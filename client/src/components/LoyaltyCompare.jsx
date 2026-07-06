import { money, int } from "../api.js";

export default function LoyaltyCompare({ loyalty }) {
  const member = loyalty.find((l) => Number(l.loyalty_member) === 1) || {};
  const nonMember = loyalty.find((l) => Number(l.loyalty_member) === 0) || {};

  const rows = [
    { label: "Loyalty members", data: member },
    { label: "Non-members", data: nonMember },
  ];

  return (
    <table className="data">
      <thead>
        <tr>
          <th>Segment</th>
          <th>Visits</th>
          <th>Revenue</th>
          <th>Avg tip</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>{int(row.data.visits)}</td>
            <td>{money(row.data.revenue)}</td>
            <td>{money(row.data.avg_tip)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
