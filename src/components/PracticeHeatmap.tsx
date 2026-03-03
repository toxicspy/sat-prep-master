import { getPracticeDays } from "@/lib/gamification";

const PracticeHeatmap = () => {
  const practiceDays = new Set(getPracticeDays());
  const today = new Date();
  
  // Build 12 weeks (84 days) of calendar data
  const weeks: { date: string; practiced: boolean; isToday: boolean }[][] = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 83); // 84 days ago
  // Align to start of week (Sunday)
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  let currentWeek: { date: string; practiced: boolean; isToday: boolean }[] = [];

  for (let i = 0; i < 91; i++) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    currentWeek.push({
      date: dateStr,
      practiced: practiceDays.has(dateStr),
      isToday: dateStr === todayStr,
    });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const months: string[] = [];
  const monthSet = new Set<string>();
  weeks.forEach((week) => {
    const d = new Date(week[0].date);
    const label = d.toLocaleDateString("en-US", { month: "short" });
    if (!monthSet.has(label)) {
      monthSet.add(label);
      months.push(label);
    }
  });

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <h3 className="text-lg font-semibold mb-4 font-sans">Practice Activity</h3>
      <div className="flex gap-0.5 text-xs text-muted-foreground mb-2">
        {months.map((m, i) => (
          <span key={i} className="flex-1">{m}</span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}${day.practiced ? " — Practiced" : ""}`}
                className={`w-3 h-3 rounded-sm transition-colors ${
                  day.isToday
                    ? "ring-1 ring-primary"
                    : ""
                } ${
                  day.practiced
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-muted" />
        <div className="w-3 h-3 rounded-sm bg-primary/40" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
};

export default PracticeHeatmap;
