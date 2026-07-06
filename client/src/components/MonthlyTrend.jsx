import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { MONTH_NAMES, money, int } from "../api.js";

export default function MonthlyTrend({ monthly }) {
  const data = monthly.map((m) => ({
    label: `${MONTH_NAMES[m.mo - 1]} '${String(m.yr).slice(2)}`,
    visits: Number(m.visits),
    revenue: Number(m.revenue),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#4a4038" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#c9bfae", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          axisLine={{ stroke: "#4a4038" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "#c9bfae", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "#c9bfae", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          axisLine={false}
          tickLine={false}
          width={56}
          tickFormatter={(v) => money(v)}
        />
        <Tooltip
          contentStyle={{
            background: "#2c2622",
            border: "1px solid #4a4038",
            fontFamily: "IBM Plex Mono",
            fontSize: 12,
          }}
          formatter={(value, name) =>
            name === "Revenue" ? money(value) : int(value)
          }
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
        <Bar yAxisId="left" dataKey="visits" name="Visits" fill="#5f8c6e" radius={[2, 2, 0, 0]} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#f0b34f"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
