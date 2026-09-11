/**
 * server.js — the backend of the ERP Analytics Dashboard.
 *
 * WHY IT'S THIS SIMPLE:
 * The dashboard reads pre-computed report data (the exact same 6
 * queries from the erp-data-cleaning-sql project's queries.sql,
 * exported once as JSON). In a real deployment, these endpoints would
 * run those SQL queries live against PostgreSQL on every request — the
 * REST API shape stays identical either way, only the data source
 * function changes. Keeping the data layer swappable like this is a
 * deliberate design choice, not a shortcut.
 *
 * Run:
 *   bun install
 *   bun run server/server.js
 * Then open http://localhost:4000/api/summary to see the raw data,
 * or run the client (see client/README section in the main README)
 * for the actual dashboard UI.
 */
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "erp_data.json");

function loadData() {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

const app = express();
app.use(cors());

// One endpoint per dashboard page, matching the master plan's 3-page
// spec (Sales / Inventory / Purchasing) plus a combined summary.
app.get("/api/sales", (req, res) => {
  const data = loadData();
  res.json({ monthly_sales: data.monthly_sales, top_products: data.top_products });
});

app.get("/api/inventory", (req, res) => {
  const data = loadData();
  res.json({ stagnant_items: data.stagnant_items });
});

app.get("/api/purchasing", (req, res) => {
  const data = loadData();
  res.json({ top_customers: data.top_customers, revenue_by_city: data.revenue_by_city });
});

app.get("/api/summary", (req, res) => {
  const data = loadData();
  res.json(data);
});

// Serve the built React app (client/dist) once it's been built.
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ERP Analytics Dashboard API running at http://localhost:${PORT}`);
});
