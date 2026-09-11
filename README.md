# ERP Analytics Dashboard

A small full-stack web dashboard (React + Express + Bun) that visualises
the exact same three reports the master learning plan's Power BI
dashboard is meant to have: **Sales**, **Inventory**, and
**Purchasing & Customers**. It reads the cleaned data produced by the
[erp-data-cleaning-sql](../erp-data-cleaning-sql) project.

**Why a web dashboard, not just Power BI?** Power BI is the tool the
job market asks for, and I'm getting certified in it (PL-300) as part
of the plan. This project exists alongside that — it uses skills I
already have (JavaScript, React, Express, Bun) to tell the exact same
data story, live and shareable by URL, and it's a project I built and
can fully explain end to end.

## Live demo

*(add a deployed link here once hosted, e.g. on Render/Railway/Vercel)*

## Screenshots

| Sales | Inventory | Purchasing |
|---|---|---|
| Monthly revenue + top products | Stagnant stock items | Top customers + revenue by city |

## Architecture

```
erp-analytics-dashboard/
├── data/erp_data.json     ← exported from the SQL project's erp.db
├── server/server.js       ← Express API (3 report endpoints + summary)
└── client/
    ├── src/App.jsx         ← 3-tab dashboard (Sales / Inventory / Purchasing)
    ├── src/BarChart.jsx    ← hand-rolled, dependency-free SVG bar chart
    └── build.js            ← esbuild bundling script (no framework needed)
```

The API and the data layer are deliberately separated: today the API
reads a static JSON export, but every endpoint maps 1:1 to a real SQL
query from the `erp-data-cleaning-sql` project's `queries.sql`. Moving
to a live PostgreSQL connection later is a change inside `server.js`
only — the API contract and the whole frontend stay untouched.

## How to run it

```bash
bun install
bun run build     # bundles the React app into client/dist
bun run server    # starts the API + serves the built app
# then open http://localhost:4000
```

Or in one step: `bun run dev`

## What I'm using this to learn

- Structuring a small full-stack app with a clean API/frontend split
- Turning SQL report queries into an actual usable interface
- Building UI without leaning on a component/chart library for
  everything — the `BarChart.jsx` component is ~50 lines and I can
  explain every line of it

## Related projects

- [erp-data-cleaning-sql](../erp-data-cleaning-sql) — where this data comes from
- [odoo-automation-toolkit](../odoo-automation-toolkit) — the Odoo side of the same workflow
