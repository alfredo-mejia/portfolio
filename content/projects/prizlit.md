---
order: 3
title: "Prizlit"
tags:
  - TypeScript
  - Next.js
  - Redis
  - Security
summary: >-
  A sweepstakes platform for businesses that take cash. Vendors without a point
  of sale hand out pre-printed QR cards at the moment of purchase; entrants scan
  once, register, and throw the card away. I am building it end to end — the
  work so far is the account and abuse-resistance foundation: a Redis
  sliding-window limiter with reservation semantics, an edge-verified client
  identity, and a sign-up flow that does not disclose whether an address is
  already registered.
summaryImage:
  src: "/projects/prizlit/cash-sale-outcomes.png"
  alt: >-
    Diagram of the entry loop: a cash purchase hands over a QR card, the scan
    registers a contact, and a social follow returns bonus entries
---

## The problem

A vendor at a flea market wants three things: more sales, a following they can
reach again, and some idea of whether either is working. A sweepstakes does all
three at once — an entry is a reason to buy, a registration is a contact, and a
bonus entry is a reason to follow.

The mechanics assume infrastructure that vendor does not have. Sweepstakes
tooling is built for businesses with a point of sale or a checkout page, because
those systems can tell you a purchase happened. A cash business hands over goods
across a table. There is no transaction record to hang an entry on.

The obvious answer fails on inspection. A QR code printed on a sign can be
scanned by anyone walking past, so it cannot represent a purchase — it
represents proximity. Whatever grants an entry has to be something the vendor
physically gives you, at the moment you pay.

That points at the oldest solution in the business: the cut-off raffle ticket.
The entry is a physical object, and handing it over _is_ the proof. What paper
tickets cannot do is tell the vendor anything. A drum full of stubs is not a
contact list, it is not a follower, and it is not a report.

So the entry stays physical and the rest moves: a pre-printed card carrying a
unique code, handed over at the sale. From there it is the customer's, and
whether they ever register is their decision — at the table, that evening, or
never. Whenever they do, the card is spent and can be thrown away, because
registration captures the contact and a redirect to the vendor's storefront or
social account, in exchange for bonus entries, turns the same purchase into
traffic and a follow.

That deferred, optional redemption is precisely why a vendor needs the numbers.
Cards handed out and cards registered are different totals, and the gap between
them is the only honest measure of whether a campaign worked.

Any one campaign can be assembled by hand — generate codes, print them, point
them at a form. What cannot be assembled by hand is the part the vendor actually
needs: card lifecycle, campaign control, and the analytics to tell whether an
event was worth attending.

## My contribution

- **Designing and building the platform end to end**, in TypeScript on Next.js,
  Postgres, and Redis. It is in active development; the foundation described
  here is what exists today.
- **A Redis sliding-window rate limiter with reservation semantics**, driven by
  atomic Lua so that concurrent requests cannot both be granted the last slot.
- **A client identity the caller cannot supply for itself**, keyed on the
  address the edge network verifies rather than any client-sent header, grouped
  by IPv6 network, and stored only as a keyed hash.
- **A sign-up flow that does not disclose whether an address is registered** —
  uniform responses, a timing floor, and single-capability signed links bound to
  an exact account.
- **22,687 lines of test against 6,655 lines of source** — 1,184 unit and
  integration cases plus 77 end-to-end flows.

## My approach

### Rate limiting is only as good as the identity it keys on

Every abuse control here counts something per client, which makes the definition
of "client" the load-bearing decision. Almost every candidate is supplied by the
caller: `X-Forwarded-For` can be prepended to, a session cookie can be dropped,
a fingerprint can be replayed.

The one trustworthy signal is `CF-Connecting-IP`, because Cloudflare overwrites
it at the edge rather than appending to it. Production trusts nothing else, and
fails closed: if the header is missing or does not parse as an address, the
request is refused rather than falling back to a value the caller controls.

IPv6 needed a second look. A client with a `/64` allocation can rotate through
enormous numbers of interface addresses at no cost, so a limiter keyed on the
full address is not a limiter at all — every request arrives as a new client.
Addresses are truncated to their `/64` prefix so the budget lands on the network
the client actually holds.

Nothing identifying is written to Redis. Addresses and emails are HMAC'd with a
scope prefix, so the same email produces a different identifier in the sign-up
bucket than in the verification bucket, and a leaked key space reveals neither
the addresses nor the mailboxes behind it.

### A window that reserves rather than counts

The limiter is a sorted set per bucket, scored by timestamp. One Lua script
trims expired entries, checks the count, and writes the new entry — so the
check and the write cannot be separated:

```lua
redis.call("ZREMRANGEBYSCORE", key, 0, now - windowMs)

if redis.call("ZCARD", key) >= limit then
  local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
  local retryMs = math.max(1, tonumber(oldest[2]) + windowMs - now)
  return { 0, retryMs }
end

redis.call("ZADD", key, now, member)
redis.call("PEXPIRE", key, windowMs)
return { 1, 0 }
```

Reading the count and then writing separately would be a race two concurrent
requests could both win. Doing it in one script makes the last slot go to
exactly one of them.

Because the set is ordered by time, a refusal can also answer _when_ rather than
guessing: the oldest surviving entry's score plus the window is the precise
moment capacity returns, which the route returns as an exact `Retry-After`
instead of a fixed backoff.

The part I find most useful is that a slot is a **reservation**, not a tally. A
login reserves its slot _before_ the password is checked and releases it if the
password was right. Someone signing in normally never accumulates against the
limit; someone guessing accumulates on every attempt. The budget is spent only
by the traffic it is meant to stop.

### The lockout problem, and the lane that fixes it

Per-account limits have a failure mode that is easy to ship and unpleasant to
discover. If an address allows ten failures per fifteen minutes, anyone who
knows that address can spend the budget deliberately and keep the real owner
out. The control meant to stop credential stuffing becomes a way to deny
service to a named person.

Removing the account limit is not an option — it is what makes distributed
guessing against one account expensive. So the account budget has a second lane
underneath it. Once the primary window is exhausted, one attempt per minute
remains available:

- A legitimate owner who typed their password wrong a few times still gets in.
- An attacker cannot hold the door shut, because the lane never fully closes.
- Guessing is still throttled to a rate that is useless for brute force.

![The primary per-account lane of ten attempts shown exhausted, with a recovery
lane of one attempt per minute still
open](/projects/prizlit/recovery-lane.png)

A refusal reports whichever lane frees up first, so the wait it quotes is the
real one. Layered underneath are a short burst window catching rapid-fire
scripted traffic and a per-IP budget on top of the per-account one, so no single
dimension has to be strict enough to carry the whole policy.

### Budgets that protect somebody else's mailbox

Verification email is the one action where the cost of abuse lands on a third
party. Anyone can type a stranger's address into a sign-up form, and without a
ceiling the form becomes a way to mail-bomb them using my sending reputation.

Three budgets apply at once: a shared hourly ceiling per recipient across every
flow, a per-flow hourly budget, and a daily recipient ceiling. All three are
reserved in a single script — either every slot is written or none is, because
checking budgets and then sending is exactly the gap through which two
concurrent sign-ups both get told there is room. All of an account's keys carry
a `{hash tag}` so a cluster keeps them on one slot and a reset stays a single
operation.

A refusal here is silent. Telling an anonymous caller that an address was
recently mailed would answer a question they have no business asking.

### A form that answers the same way every time

The sign-up route returns the same `201` whether the address is new, pending
verification, or already registered. The branch shows up only in which message
the mailbox owner receives — a verification link, or a notice that somebody
tried to register their address.

A uniform body is not enough on its own, because the branches do different
amounts of work, and the difference is measurable. Every response is held to a
minimum duration so the fast paths cannot be distinguished from the slow ones.

The notice sent to an address someone else used carries a link that deletes the
pending registration, and that link stays valid for 180 days while a
verification link lasts an hour. The asymmetry is deliberate: the notice is the
only warning that mailbox will ever get, and it has to still work whenever the
owner reads it. It is safe precisely because of what it cannot do — it removes
only an unverified account, so the moment the address is confirmed the link
becomes inert.

Both links are signed JWTs, and each carries exactly one capability, so a
deletion link can never activate an account. Each is bound to the normalized
address _and_ the immutable account id, which closes a delete-and-recreate race
where an old link could otherwise act on a newer account that reused the
mailbox. Verification also refuses any token whose lifetime does not match its
purpose exactly, and rejects unknown claims outright rather than ignoring them.

### Two signals for one decision

The custom auth routes call the auth library directly rather than through its
router, which means they also skip that router's origin check. Without a
replacement they would accept cross-origin POSTs — on a login route that is
login-CSRF, quietly signing a victim into an account the attacker controls.

The guard uses two independent signals because each alone has a gap.
`Sec-Fetch-Site` is set by the browser and cannot be overridden from script, but
older clients omit it. `Origin` is near-universal but absent on some requests.
A `cross-site` verdict is decisive on its own; a missing `Origin` is accepted
only with an explicit same-origin signal to stand in for it; and a deployment
with no configured origin to compare against refuses rather than silently
disabling the check.

That last clause exists because of a real defect. An earlier revision guarded
the comparison with a condition that was false whenever the header was absent —
so omitting one header skipped the entire check. The fix was not a better
comparison but a different default: ambiguity refuses.

Sitting in front of all of it, Turnstile is what makes scripted attacks
expensive in the first place, and a per-request CSP nonce is generated in the
proxy so no inline script runs without one.

### Failing closed on purpose

Postgres and Redis both carry short connect, command, and statement timeouts,
and the auth routes treat an unavailable limiter as a refusal rather than a
bypass. The failure mode of a security control under load should be _no_, not
_yes_, and not _hang_. Both clients are cached on `globalThis` in development,
because Next re-evaluates modules on hot reload and a fresh pool per reload
leaks connections until Postgres stops accepting them.

![The guard sequence an auth request passes through, each with its own refusal
status, ending in a 503 rather than a bypass when the limiter is
unreachable](/projects/prizlit/request-gauntlet.png)

### Testing the parts that are hard to see

Most of what is described here is invisible when it works — a race that does not
happen, an address that cannot be enumerated. That is the kind of behavior that
rots silently, so the suite is deliberately larger than the application:
**22,687 lines of test against 6,655 lines of source.** 1,184 unit and
integration cases run against real Postgres and Redis containers rather than
mocks, since the properties worth testing here are atomicity and expiry, and a
fake gets both right by construction. 77 Playwright flows cover the journeys end
to end, alongside contract tests against the auth library and a test that the
production build itself succeeds.

## The outcome

Prizlit is in active development. What exists today is the foundation the rest
of the product sits on, and I would rather report that accurately than imply a
finished platform.

- **The account and abuse-resistance layer is complete** — layered rate limits
  with reservation semantics, verified client identity, recipient-protecting
  email budgets, enumeration-resistant sign-up, CSRF and CSP at the edge.
- **The abuse controls are the product's insurance.** A sweepstakes is a
  standing invitation to automate entries; a platform that cannot tell one
  entrant from a script has no prizes left to give and no analytics worth
  reading.
- **A test suite roughly 3.4× the size of the source**, chosen because the
  guarantees here are concurrency and information-disclosure properties, which
  do not announce their own regressions.
- **The product case is one purchase producing three outcomes**: an entry that
  encouraged the sale, a contact the vendor can reach again, and a follow or
  visit from the bonus-entry redirect — for a business whose only prior record
  of that sale was cash in a box.

The next stages are the campaign and card lifecycle, the entrant-facing scan
flow, and vendor analytics — then integrations with point-of-sale and
e-commerce, so one campaign can span an in-person table and an online store
instead of forcing the vendor to run two.

## What I learned

The hardest problem was not technical. Cash businesses cannot prove a purchase
happened, and no amount of software fixes that from the outside — so the entry
had to become a physical object handed across the table, and the only real
design question was which parts stayed on paper and which moved. What changed
was who keeps it. A raffle stub goes into the vendor's drum and is worth nothing
afterwards; the card goes into the customer's pocket and stays valid until they
decide to use it, if they ever do. The vendor is left holding a record instead
of a pile of paper.

The engineering lesson was that rate limiting is an availability feature as much
as a security one. A per-account limit strict enough to stop guessing is also a
tool for locking a named person out of their own account, and noticing that the
control has two victims — the attacker and the owner — is what turns a threshold
into a design. The same instinct runs through the rest: a uniform response body
means nothing if the timing still answers the question, and a guard that skips
itself when a header is missing is worse than no guard, because it looks like
protection in the diff.
