---
order: 2
title: "Federated query parity"
tags:
  - C++
  - SQL
  - Query federation
  - Distributed systems
summary: >-
  A two-year program set out to give enterprise application customers one modern
  analytics canvas over both live transactional data and warehouse history. That
  only works if the same question returns the same number in both systems. I
  owned the federated query target and designed a physical-query join format
  that carries its own topology across the boundary, implementing it in both the
  producing and the consuming codebase to bring the two platforms into
  agreement.
summaryImage:
  src: "/projects/federated-query-parity/topology-lost-and-kept.png"
  alt: >-
    Diagram contrasting a condensed join tree, which loses which tables were
    joined, with an explicit pairwise join spec that preserves it
---

## The problem

Customers of a large enterprise application suite had two ways to report on
their data, and had to choose between them.

The transactional reporting engine queried live operational data through the
application's own layer, so its numbers were current to the second and its
security rules were the application's own. What it lacked was a modern authoring
experience, and it could not blend in anything from outside the application.

The analytics platform was the opposite. It offered modern authoring,
visualization, and machine learning, and it could join application data to
anything else the business had — but it read from a warehouse populated on a
refresh schedule, so its numbers lagged.

The program's goal was to collapse that choice: one modern canvas, backed by
both live transactional data and warehouse history, so an operational figure and
a multi-year trend could sit in the same dashboard.

There was a precondition. **The same query had to return the same numbers in
both places.** A customer with years of established reports will not migrate
onto a platform whose numbers they cannot reconcile against the ones they
already trust — and a discrepancy doesn't read as an interesting edge case, it
reads as the new system being wrong. Parity was not a quality goal layered on at
the end. It was the gate the entire program had to pass to ship at all.

## My contribution

- **Owned the federated query target** that lets the analytics engine query the
  transactional reporting engine, across a two-year platform unification
  program.
- **Designed a physical-query join format that preserves join topology** across
  the system boundary, replacing a representation that silently discarded it.
- **Implemented it on both sides** — the engine that produces the query and the
  engine that consumes it — behind a flag both codebases honor, so the new
  format is opt-in and every query without it behaves exactly as before.
- **Drove result parity**, tracking down the semantic divergences that made
  identical queries return different answers and reconciling the two platforms
  on the cases I targeted.

## My approach

### Two engines, one answer

The federated path is not a database connection. The analytics engine generates
a physical query and sends it to the transactional reporting engine, which
translates it into the XML request the application layer expects. That layer
resolves the request and returns executable SQL, with the access rules it owns
already applied, and the analytics engine runs that SQL against the warehouse.

The indirection has a reason. The application layer is the only route to that
system's metadata and to the rules governing who may see what, so the
transactional reporting engine is not answering the query here — it is acting
as a bridge to the part of the system that can.

![Sequence diagram: the analytics engine sends a physical query to the
transactional reporting engine, which builds an XML request for the application
layer; the returned SQL travels back and is run against the
warehouse](/projects/federated-query-parity/round-trip.png)

### The information the boundary throws away

Because the analytics engine sends a _physical_ query, the receiving side skips
its own semantic model — the layer that knows how tables relate, which
direction a relationship runs, and which side of it is the source. It builds the
XML from the SQL text alone.

That is where the problem lives, because SQL flattens exactly the property the
application layer depends on. Its relationships are directional links between
view objects, and a view object may be used **at most once as a destination**.
Given three relationships:

```text
A ↔ B
B ↔ C
B ↔ D
```

a conventional plan condenses them into a single left-deep tree:

```sql
(((A join B) join C) join D)
```

Read that back with no semantic model to consult and the topology is gone. The
consumer cannot see that C and D both hang off B, so it searches for
relationships among all the pairs — inventing links that were never in the
query, and violating the one-destination rule in the process. The same logical
question produced different XML, and different XML produced different numbers.

This is a shape worth naming: a join tree encodes _which tables participate_,
while the application layer needed _which table was joined to which, and in
which direction_. The second cannot be recovered from the first. A format that
loses information isn't untidy — it's a correctness bug that surfaces as a
number a customer cannot reconcile.

### An approach I rejected

Many of the relationships were named after the objects they connected, in the
form `ViewObject1ToViewObject2`. Parsing that name would recover the direction,
and it would have been a small change.

I did not take it. The convention was not universal, and nothing enforced it —
a link named in a different style, or with the two ends transposed, would
produce a confidently wrong join rather than an error. Resting a parity
guarantee on a human naming habit means the guarantee holds until someone names
something reasonably and differently. The topology had to be carried
deliberately, not inferred.

### A join format that carries its own topology

The fix was to stop condensing and state each join explicitly, as a pair:

```sql
((A join B) join (B join C)) join (B join D)
```

The reason this is enough — and the reason it doesn't need arbitrary nesting —
is that an application-layer link is _always_ between exactly two objects. Every
relationship in the query can therefore be written as one pair, and pairs can
simply be appended. There is no case requiring a deeper structure, so the format
stays flat no matter how large the query grows, and both membership and
direction survive the crossing.

The visitor-based generator localizes syntax rules, so the new spelling itself
was a contained change. Emitting it was not.

The format repeats tables by design — B appears in all three pairs above — but
the generator walks a plan of distinct nodes, not a graph with shared
references. Pointing three separate join nodes at one table node would mean the
visitor arriving at that same node three times, once for each occurrence it was
supposed to represent independently. So every repeat appearance needed its own
deep copy of the table, and the generator had to track which tables it had
already placed in order to know when the next reference required a copy rather
than the original.

That is the real cost of an explicit format. Every occurrence you state is an
occurrence you have to materialize, and the bookkeeping for that lives in the
producer whether or not the format looks tidy on the page.

![Three join nodes referencing one shared table node, versus each join node
pointing at its own deep copy of that
table](/projects/federated-query-parity/deep-copies.png)

### Teaching the other side to read it

Producing the format is only half a protocol. The consuming generator had to
reconstruct the graph from it: take the first table in a join node, walk the
spec to find everything it joins to, repeat for each newly seen table, and skip
any table already resolved. That yields the relationships the query actually
names — and only those, so no invented links and no violated destination rule.

Shipping it was its own constraint, because the two sides are separate
codebases. I put a flag on the physical query: the producing side emits the new
format only when the flag is set, and the flag itself is inert until a consumer
that understands it reads it. Everything without the flag takes the path it
always took, so the new format is strictly opt-in rather than a change every
existing query inherits.

### Parity is a long tail of small disagreements

Join topology was the structural problem. Most of the remaining work was smaller
divergences, each of which produced a wrong number just as effectively:

- **An unconditional `DISTINCT`.** The analytics engine added it to every plan;
  the reference platform did not. Identical queries, different row counts. The
  fix was to stop adding it on this target unless the query called for it.
- **Drive-table joins.** That strategy leaves a placeholder parameter in the
  physical plan for the driven side to fill in during a nested-loop join. The
  remote side has no way to resolve such a placeholder, and only the local
  engine can execute that shape at all, so the strategy is disabled when the
  driven side would ship across the boundary.

Individually these are small. Collectively they are the whole distance between
a system that usually matches and a system that matches.

## The outcome

- **The two platforms agree on the query shapes I targeted.** Results from the
  analytics engine reconcile against the transactional reporting engine running
  the same query directly. That is the condition the program has to meet before
  customers can be asked to move, demonstrated on the cases I worked on rather
  than certified across every report a customer owns.
- **A join format that survives the boundary**, implemented in both the
  producing and the consuming codebase and gated behind a flag, so the new path
  is opt-in and existing behavior is untouched.
- **Federated ownership across a two-year program**, covering the query target
  itself and the semantic reconciliation work behind it.
- **Parity is what makes the migration case arguable at all.** Without it, a
  customer moving to modern authoring would have to re-check numbers they have
  trusted for years; each reconciled query shape is one less category of report
  they would have to audit by hand.

## What I learned

The interface between two systems has to carry meaning, not just data. A join
tree and a set of directional links look close enough to interchange, and the
gap between them stayed invisible until it surfaced as a number that didn't
match. When two systems must agree, whatever the format quietly drops is exactly
where they will diverge.

The other lesson was about correctness at a distance. Parity isn't won by one
clever fix; it is won by treating every small behavioral difference — a
defaulted keyword, an execution strategy that can't cross the boundary — as a
defect rather than a footnote. Nobody reconciles a report by reading a
changelog. The number either matches or it doesn't.
