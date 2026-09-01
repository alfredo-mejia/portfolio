---
order: 1
title: "Cross-database query pushdown"
tags:
  - C++
  - SQL
  - Query optimization
  - Databases
summary: >-
  A business intelligence engine answers one logical query language across many
  physical databases, deciding for every part of a query whether the database
  can do the work or the engine has to do it in memory. I refreshed four dialect
  generators, Amazon Redshift among them, and wrote three new ones — MySQL
  HeatWave, Vertica, and a path to the transactional reporting engine — so more
  of that work runs where the data already lives. On the report queries I
  targeted, production latency fell from roughly 40–50 seconds to 7–11 seconds.
summaryImage:
  src: "/projects/cross-database-query-pushdown/double-dispatch.png"
  alt: >-
    Diagram of double dispatch: a query node and a generator exchanging
    TourExpr and Visit calls, over three query node subtypes
---

## The problem

An analyst drags five fields onto a dashboard and expects a chart. Underneath,
that gesture becomes a logical query that has to be answered by whichever
database the dataset happens to live in — each with its own dialect, its own
function coverage, and its own quirks.

The engine that resolves this splits the work. It decomposes the logical query,
checks each part against what the target database is known to support, emits
physical SQL for the supported parts, and executes everything else itself after
the rows come back. Something always goes to the database, because the engine
needs data to work with at all. The open question on every query is only ever
_how much_ goes.

That decision is driven by a per-source capability matrix: a list of features
with a supported or unsupported flag, kept in a configuration file the engine
parses. The matrix is a model of the database, and models drift. Databases ship
new functions, change how existing ones behave, and add whole execution engines.
When the matrix understates what a source can actually do, nothing appears to
break — and that is exactly the problem. The query still returns correct
results. It just returns them slowly, because the engine pulled a wide,
unaggregated result set across the network and finished the job in its own
memory.

The business cost of a stale entry isn't a bug report, it's a tax. It is paid by
every user, on every refresh, indefinitely. At 40–50 seconds a dashboard,
analysts stop exploring, start exporting to spreadsheets, and the platform
quietly loses the seat it was bought for.

## My contribution

- Updated **four existing SQL generators**, Amazon Redshift among them,
  rewriting generation rules so the engine emits pushdown-capable SQL for
  database features it had been declining to use.
- Added **three new generation paths**: MySQL HeatWave, Vertica, and a service
  interface for querying a transactional reporting engine over XML.
- Reduced latency on the affected query shapes from roughly **40–50 seconds to
  7–11 seconds**, primarily by moving aggregation off the engine and onto the
  database.

## My approach

### How a logical query becomes physical SQL

Generation walks the query from the top down. The root is the statement; below
it sit the projection list, the joins, and the filter predicates, and each of
those decomposes further until the traversal reaches individual functions and
column references. At every node the generator asks the same question — can the
target database do this itself? — and then descends into that node's children.

Two kinds of dispatch run at once, and keeping them straight is most of the
design. Both sketches below are simplified and paraphrased rather than lifted
from the codebase.

**Down the query tree**, each generator is a visitor. A node accepts the
generator and double-dispatches back through its own traversal, so the generator
never has to switch on node type by hand:

```cpp
void Generator::Visit(const AggregateExpr& expr) {
  if (!capabilities().Supports(Feature::kAggregate, expr.function())) {
    MarkForLocalExecution(expr);   // the engine will compute this after fetch
    return;
  }

  Emit(DialectName(expr.function()));
  Emit("(");
  expr.argument()->TourExpr(*this);  // recurse; children decide for themselves
  Emit(")");
}
```

**Across dialects**, the generators themselves form an inheritance hierarchy:
generic SQL behavior in a base class, progressively more specialized subclasses
beneath it, and a database-specific generator at the leaf.

```cpp
class SqlGenerator {                        // generic, dialect-agnostic SQL
  virtual void Visit(const AggregateExpr&);
};

class MySqlGenerator : public SqlGenerator { /* dialect spelling, quoting */ };

class HeatWaveGenerator : public MySqlGenerator {
  void Visit(const AggregateExpr& expr) override;   // same syntax, new policy
};
```

Virtual dispatch resolves each call straight to the most-derived override rather
than chaining through the parents on the way, so a specialized generator
implements only the nodes where its dialect or its pushdown policy actually
differs and inherits everything else by simply not overriding it. That is what
makes adding a database tractable: a new generator is a delta against behavior
that already works, not a reimplementation of SQL generation.

![Generator hierarchy: SqlGenerator at the base, MySqlGenerator and
VerticaGenerator extending it, and HeatWaveGenerator extending MySqlGenerator to
override one method](/projects/cross-database-query-pushdown/generator-inheritance.png)

The cost model comes from the first axis. Control descends from the root, but
the answer composes on the way back up — a node can only be delegated to the
database if every child beneath it could be. Every node either emits dialect
text and recurses, or gives up and marks its subtree for local execution.

![Query tree with control descending from the statement to an unsupported
function, and the pushable verdict composing back
up](/projects/cross-database-query-pushdown/traversal.png)

And local execution is contagious upward. Once a subtree has to be computed
inside the engine, everything above it in the tree has to be computed there too
— you cannot ask the database to sum a column it was never able to produce. A
single unsupported scalar function buried in a projection can strand the entire
aggregation above it, turning a query that should have returned a few hundred
grouped rows into one that drags back millions of raw ones.

That is the whole mechanism behind the tax described above: one stale capability
flag, one stranded subtree, forty seconds.

What makes a capability gap expensive, then, is not the gap itself but where it
sits. The same unsupported function costs almost nothing above an aggregate and
almost everything below it:

```sql
-- gap below the aggregate: the database cannot produce the values to sum,
-- so the grouping cannot be delegated either
SELECT region, SUM(odd_func(amount)) FROM orders GROUP BY region;

-- gap above it: the database still groups and sums, and the engine applies
-- one unsupported function to the handful of rows that come back
SELECT region, odd_func(SUM(amount)) FROM orders GROUP BY region;
```

![Two query trees with the same unsupported function in different positions:
below the aggregation only the scan is delegated and millions of rows cross to
the engine, while above it the database groups and sums and roughly two hundred
rows cross](/projects/cross-database-query-pushdown/pushdown-cut.png)

A capability gap costs whatever work was sitting beneath it, which is why the
flag alone never tells you what a stale entry is worth.

### Declaring support is a promise the generator has to keep

Widening pushdown means three things have to agree, and the interesting failures
come from cases where only two of them do:

1. **The capability matrix** has to claim the source supports the operation.
2. **The generator** has to emit that operation correctly in the target dialect
   — not merely similarly.
3. **The fallback path** has to still exist for the genuine gaps, so unsupported
   work runs in the engine rather than failing.

Flipping a matrix flag without teaching the generator produces malformed SQL, or
worse, SQL that parses cleanly and returns different numbers. Two databases can
accept identical syntax and still disagree on the answer: where NULLs sort, how
strings compare under a collation, whether integer division truncates or
promotes, where a week boundary falls in a date truncation, whether a wide sum
overflows or widens.

Preserving the meaning of a query is the constraint that makes this work
difficult, and it is the reason expanding pushdown is engineering rather than
configuration. Faster and wrong is a regression.

### Aggregation is where the time actually goes

Analytical workloads are overwhelmingly aggregate-shaped, so aggregation is
where pushdown pays. Delegating a grouped aggregate changes the volume crossing
the network from the cardinality of the rows to the cardinality of the groups —
frequently orders of magnitude — and hands the work to an engine with indexes,
statistics, and parallelism built for it.

Not every aggregate delegates whole. Some decompose: the database returns
partial aggregates per group and the engine finalizes them, which keeps most of
the data reduction while preserving exact semantics for metrics that cannot be
computed in a single pass. Getting those decompositions right mattered more than
adding raw function coverage.

The generators I refreshed benefited from exactly this reasoning. Amazon
Redshift is columnar and massively parallel, so the aggregate work its generator
had been holding back was work the database was built to do faster than the
engine ever could.

### MySQL HeatWave: a policy change, not a syntax change

[MySQL HeatWave](https://dev.mysql.com/doc/heatwave/en/) arrived in 2020, and
by 2022 supporting it properly mattered on two fronts: customers were asking for
it, and the database was our own company's product, which makes first-class
support a goal in itself rather than a nice-to-have.

The obvious question is why the existing MySQL generator wasn't enough, given
the shared dialect.

Largely, it was — the HeatWave generator extends it. That is the clearest
illustration of why the hierarchy is shaped the way it is: what HeatWave
inherits is the dialect, and what it overrides is the judgment about where work
should run.

The MySQL generator was conservative _by design_. It was tuned for a row-based
transactional store that degrades badly on large multi-table aggregations, so it
deliberately held work back and let the engine do it. HeatWave adds an in-memory
columnar accelerator, which inverts that judgment: complex aggregations, nested
subqueries, and heavy window functions belong on the database. Same syntax,
because it is inherited; opposite default, because it is overridden.

Treating it as a separate target also made room for the things that differ below
the SQL text — initializing sessions so analytical execution is actually engaged
rather than silently falling back to row-based execution, and tuning fetch sizes
and cursor buffering for bulk columnar streaming instead of low-latency
single-row transactions. Silent fallback deserves special mention: it does not
raise an error, it just gets slow, so surfacing whether a query was accelerated
is a real diagnostic feature rather than a nicety.

### Vertica: source coverage as migration insurance

Customers arrived with substantial analytics estates already standing on
[Vertica](https://docs.vertica.com/), a columnar MPP warehouse, and no intention
of rebuilding their reporting as the price of moving. There was no Vertica
generator.

The business case here isn't performance, it's continuity. Reporting cannot go
dark while data moves, and asking an organization to rebuild its dashboards as
the price of admission is how adoption stalls. Teaching the engine to speak
Vertica meant existing analytics kept working against data where it already sat,
and moving it became a scheduling question instead of a blocking one.

### A path to the transactional reporting engine

The third target wasn't a database at all. It was a transactional reporting
engine reached through a service call rather than a SQL connection, and it
builds its XML requests with a generator of its own. What I built was the
generator on the analytics side, plus the interface that let the engine treat
that system as one more source it could query, alongside the databases it
already spoke to.

That path runs in stages, and none of them is ordinary SQL generation. The
engine generates a physical query and hands it to the remote transactional
system, which translates it into the XML request the application layer expects.
That layer resolves the request and returns executable SQL, with the access
rules it owns already applied. The SQL comes back to the engine, which rewrites
it once more and checks it against the logical query it started from before
running it against the data warehouse. SQL arriving from another system cannot
be taken on faith to answer the question that was actually asked.

The transactional reporting engine decides what should be asked; the warehouse
does the work of answering it. Splitting it that way keeps the authoritative
model with the system that owns it while pointing the actual scan at a database
built for analytical load.

Several engineers have extended this path since it was first built, myself among
them. My later work on it was on the rewrite, on both sides of the exchange: the
codebase that issues the request, and the one that resolves it and returns the
SQL.

The result is that content defined in the transactional reporting engine's model
can be answered out of the warehouse, through a source the analytics engine
previously had no way to query at all.

### Verifying before claiming

Each change was checked by reading the SQL the engine actually emitted,
confirming the delegated query returned results identical to the local-execution
path, and only then measuring. The correctness check comes first because the
failure mode of this work is a query that got faster by computing something
subtly different.

## The outcome

- **Latency on the targeted query shapes dropped from roughly 40–50 seconds to
  7–11 seconds** — the difference between a dashboard someone waits on and one
  they explore with. I observed those gains in production on both MySQL
  HeatWave and Amazon Redshift. This covers the query patterns I worked on, not
  a benchmark across every workload or a comparison between the two databases.
- **Seven generation paths were improved or created** — four existing generators
  updated, three added — widening the set of databases the platform can query
  well rather than merely connect to.
- **Two integrations with different drivers**: HeatWave, where the database was
  our own company's product and first-class support was its own goal, and
  Vertica, extending coverage to estates the platform previously could not
  query.
- **Less work per query inside the engine**, since computation delegated to the
  database is memory and CPU the engine no longer spends on rows it was only
  going to discard during aggregation.

## What I learned

The expensive decision in a query engine is _where_ the work runs, not how
elegantly the code that decides is written. A capability model is the
highest-leverage code in a system like this, and the easiest to let rot, because
when it is wrong the system still returns correct answers — it just quietly gets
slower, and no one files a bug against a number that was never fast.

The lesson I took forward is to treat the boundary between systems as the first
place to look when something is slow. Start from the delay a user actually
experiences, find the point where the work crosses a process or network line,
and ask what it would take to move that line.
