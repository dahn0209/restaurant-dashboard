import { money, int } from "../api.js";

export default function ServerLeaderboard({ servers }) {
  return (
    <table className="data">
      <thead>
        <tr>
          <th>#</th>
          <th>Server</th>
          <th>Visits</th>
          <th>Total tips</th>
          <th>Avg tip</th>
        </tr>
      </thead>
      <tbody>
        {servers.map((s, i) => (
          <tr key={s.server_emp_id}>
            <td className="rank">{i + 1}</td>
            <td>{s.server_name}</td>
            <td>{int(s.visits)}</td>
            <td>{money(s.total_tips)}</td>
            <td>{money(s.avg_tip)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
