import { money, int } from "../api.js";

export default function KpiStrip({ overview }) {
  const items = [
    { label: "Total visits", value: int(overview.total_visits) },
    { label: "Restaurants", value: int(overview.total_restaurants) },
    { label: "Unique customers", value: int(overview.unique_customers) },
    { label: "Total revenue", value: money(overview.total_revenue) },
    { label: "Food revenue", value: money(overview.total_food) },
    { label: "Alcohol revenue", value: money(overview.total_alcohol) },
    { label: "Tips collected", value: money(overview.total_tips) },
  ];

  return (
    <div className="kpi-strip">
      {items.map((item) => (
        <div className="kpi" key={item.label}>
          <span className="label">{item.label}</span>
          <span className="value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
