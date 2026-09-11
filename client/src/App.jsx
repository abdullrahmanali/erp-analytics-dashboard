import React, { useEffect, useState } from "react";
import BarChart from "./BarChart.jsx";

// The dashboard and the API can be deployed separately, so the API's
// base URL is overridable at runtime via window.API_BASE (set this in
// index.html when deploying) instead of being baked in at build time.
const API_BASE = (typeof window !== "undefined" && window.API_BASE) || "http://localhost:4000";

const money = (n) => `${n.toLocaleString()} SAR`;

function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}${path}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, error };
}

function SalesPage() {
  const { data, error } = useApi("/api/sales");
  if (error) return <ErrorBox message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="page">
      <h2>Sales</h2>
      <p className="page-note">Monthly revenue from delivered orders, and best-selling products.</p>
      <div className="card">
        <h3>Monthly Revenue</h3>
        <BarChart data={data.monthly_sales} labelKey="month" valueKey="revenue" formatValue={money} />
      </div>
      <div className="card">
        <h3>Top Products by Units Sold</h3>
        <BarChart data={data.top_products} labelKey="product_name" valueKey="total_units_sold" />
      </div>
    </div>
  );
}

function InventoryPage() {
  const { data, error } = useApi("/api/inventory");
  if (error) return <ErrorBox message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="page">
      <h2>Inventory</h2>
      <p className="page-note">
        Stagnant items: in stock, but with zero delivered orders — candidates for a promotion or a
        stock review.
      </p>
      <div className="card">
        {data.stagnant_items.length === 0 ? (
          <p>No stagnant items right now — every in-stock product has sold at least once.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Product</th><th>Units in stock</th></tr>
            </thead>
            <tbody>
              {data.stagnant_items.map((item) => (
                <tr key={item.product_name}>
                  <td>{item.product_name}</td>
                  <td>{item.stock_qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PurchasingPage() {
  const { data, error } = useApi("/api/purchasing");
  if (error) return <ErrorBox message={error} />;
  if (!data) return <Loading />;
  return (
    <div className="page">
      <h2>Purchasing &amp; Customers</h2>
      <p className="page-note">Top customers by spend, and revenue by city.</p>
      <div className="card">
        <h3>Top 5 Customers</h3>
        <BarChart data={data.top_customers} labelKey="customer_name" valueKey="total_spent" formatValue={money} />
      </div>
      <div className="card">
        <h3>Revenue by City</h3>
        <BarChart data={data.revenue_by_city} labelKey="city" valueKey="revenue" formatValue={money} />
      </div>
    </div>
  );
}

function Loading() {
  return <p className="loading">Loading…</p>;
}

function ErrorBox({ message }) {
  return (
    <div className="error-box">
      Couldn't reach the API at {API_BASE}. Is the server running?
      <br />
      <code>{message}</code>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("sales");
  const tabs = [
    { id: "sales", label: "Sales", render: SalesPage },
    { id: "inventory", label: "Inventory", render: InventoryPage },
    { id: "purchasing", label: "Purchasing", render: PurchasingPage },
  ];
  const Active = tabs.find((t) => t.id === tab).render;

  return (
    <div className="app">
      <header>
        <h1>ERP Analytics Dashboard</h1>
        <p className="subtitle">Data from the erp-data-cleaning-sql project, served through a small Express API.</p>
      </header>
      <nav>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main>
        <Active />
      </main>
    </div>
  );
}
