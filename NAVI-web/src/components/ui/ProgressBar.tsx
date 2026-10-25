type ProgressBarTone = "solid" | "medium" | "light";

interface ProgressBarProps {
  value: number; // 0 a 100
  tone?: ProgressBarTone;
  className?: string;
}

const tones: Record<ProgressBarTone, string> = {
  solid: "bg-[#5960A1]",
  medium: "bg-[#5960A1]/60",
  light: "bg-[#5960A1]/30",
};

export default function ProgressBar({
  value,
  tone = "solid",
  className = "",
}: ProgressBarProps) {
  return (
    <div className={`w-full bg-slate-100 h-2 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${tones[tone]} h-full rounded-full`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
