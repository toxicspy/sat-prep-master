import { Difficulty } from "@/data/questions";

interface Props {
  selected: Difficulty | "mixed";
  onChange: (d: Difficulty | "mixed") => void;
}

const options: { value: Difficulty | "mixed"; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const DifficultyFilter = ({ selected, onChange }: Props) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs font-medium text-muted-foreground">Difficulty:</span>
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          selected === o.value
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default DifficultyFilter;
