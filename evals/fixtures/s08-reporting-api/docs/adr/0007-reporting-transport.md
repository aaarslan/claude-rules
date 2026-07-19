# 7. Transport for the reporting API

- Status: Accepted
- Date: 2026-02-11
- Deciders: platform team, data team
- Supersedes: none

## Context

Reporting is served to three consumers: the in-app dashboard, a nightly export
job, and two enterprise customers pulling numbers into their own warehouses.
Traffic is low volume and highly cacheable. A typical request asks for one
report over one date range, and the same handful of shapes account for nearly
all of it.

Report queries are expensive on the warehouse. The controls that keep them
affordable are per-endpoint rate limits, per-endpoint cost estimates rejecting
oversized ranges, and CDN caching keyed on the URL. Our external consumers
integrate over plain HTTP with tooling that assumes cacheable GET requests.

We considered a GraphQL layer in front of reporting. The argument for it was
that dashboards could select exactly the fields they need and compose several
reports into one round trip, instead of us adding an endpoint each time the
dashboard grows a panel.

## Decision

Reporting is served over REST. Each report is a resource with its own path,
registered in the route table in `src/reportingRoutes.js`, returning JSON and
declaring its own cache and rate-limit policy. New reports are added as new
endpoints following that pattern.

We reject GraphQL for reporting, for these reasons:

1. **Cost control.** Our per-endpoint cost estimation and rate limiting depend
   on knowing the query shape before execution. Arbitrary client-composed
   queries defeat that, and the warehouse bill is the constraint that matters
   most here.
2. **Caching.** CDN caching keyed on URL is what keeps repeat dashboard loads
   off the warehouse entirely. A single POST endpoint gives up that layer, and
   persisted-query workarounds recover it only by reintroducing a fixed set of
   shapes, which is what we already have.
3. **Consumer fit.** The external warehouse integrations consume cacheable
   GET endpoints. Moving them to GraphQL is a breaking change with no benefit
   to them.
4. **Cost of ownership.** A GraphQL layer adds a schema, a resolver layer,
   depth and complexity limiting, and a second authorization surface. The
   problem it solves for us is "the dashboard occasionally needs a new panel",
   which is a small, well-understood amount of work.

## Consequences

- Adding a dashboard panel that needs new data means adding or extending an
  endpoint. This is deliberate: it puts each new query shape in front of a
  reviewer who can check its warehouse cost.
- Dashboards that need several reports issue several requests. These are
  cacheable and parallel, and measured page load is well inside budget.
- Over-fetching is handled per endpoint with explicit `fields` filtering where
  a payload is genuinely too large, not by a general query language.
- If reporting consumers ever become many and their query shapes genuinely
  unpredictable, this decision should be revisited with fresh numbers. That is
  not the situation today.
