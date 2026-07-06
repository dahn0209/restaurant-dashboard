import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { int } from "../api.js";

function MiniBarChart({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 16 }}>
        <CartesianGrid stroke="#4a4038" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#c9bfae", fontSize: 11, fontFamily: "IBM Plex Mono" }}
          axisLine={{ stroke: "#4a4038" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#f4ede1", fontSize: 12, fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            background: "#2c2622",
            border: "1px solid #4a4038",
            fontFamily: "IBM Plex Mono",
            fontSize: 12,
          }}
          formatter={(v) => int(v)}
        />
        <Bar dataKey={dataKey} fill={color} radius={[0, 3, 3, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PaymentMethodBars({ data }) {
  return <MiniBarChart data={data} dataKey="visits" color="#f0b34f" />;
}

export function MealTypeBars({ data }) {
  return <MiniBarChart data={data} dataKey="visits" color="#5f8c6e" />;
}
