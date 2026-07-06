import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { money } from "../api.js";

const COLORS = ["#f0b34f", "#b85c43"];

export default function FoodAlcoholSplit({ overview }) {
  const data = [
    { name: "Food", value: Number(overview.total_food) },
    { name: "Alcohol", value: Number(overview.total_alcohol) },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i]} stroke="#2c2622" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#2c2622",
            border: "1px solid #4a4038",
            fontFamily: "IBM Plex Mono",
            fontSize: 12,
          }}
          formatter={(value) => money(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
