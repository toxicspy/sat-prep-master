import { TestAttempt } from "@/lib/storage";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  attempts: TestAttempt[];
}

const PerformanceChart = ({ attempts }: Props) => {
  if (attempts.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
        Complete at least 2 tests to see your performance trend.
      </div>
    );
  }

  const data = [...attempts]
    .reverse()
    .slice(-10)
    .map((a, i) => ({
      name: `#${i + 1}`,
      score: a.percentage,
      date: new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
