import { money, int } from "../api.js";

export default function RestaurantTickets({ restaurants }) {
  return (
    <div className="ticket-grid">
      {restaurants.map((r) => (
        <div className="ticket" key={r.restaurant_id}>
          <div className="t-name">{r.restaurant_name}</div>
          <div className="t-loc">
            {r.city}, {r.state} · {r.has_table_service ? "Table service" : "Counter service"}
          </div>
          <div className="t-rows">
            <div className="t-row">
              <span>Visits</span>
              <span>{int(r.visits)}</span>
            </div>
            <div className="t-row">
              <span>Unique customers</span>
              <span>{int(r.unique_customers)}</span>
            </div>
            <div className="t-row">
              <span>Revenue</span>
              <span>{money(r.revenue)}</span>
            </div>
            <div className="t-row">
              <span>Food / Alcohol</span>
              <span>
                {money(r.food_total)} / {money(r.alcohol_total)}
              </span>
            </div>
            <div className="t-row">
              <span>Avg party · wait</span>
              <span>
                {r.avg_party_size ?? "—"} · {r.avg_wait_time ?? "—"}m
              </span>
            </div>
          </div>
          <div className="t-foot">
            <span>Alcohol attach rate</span>
            <b>{r.alcohol_attach_rate ?? 0}%</b>
          </div>
        </div>
      ))}
    </div>
  );
}
