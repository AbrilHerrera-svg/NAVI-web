import Card from "./Card";
import Badge from "./Badge";

export type AlertTagColor = "danger" | "warning" | "success" | "info" | "neutral";

interface AlertCardProps {
  tag: string;
  tagColor: AlertTagColor;
  count: number;
  title: string;
  desc: string;
  link: string;
  onLinkClick?: () => void;
}

export default function AlertCard({
  tag,
  tagColor,
  count,
  title,
  desc,
  link,
  onLinkClick,
}: AlertCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        <div className="flex justify-between items-start mb-2">
          <Badge color={tagColor}>{tag}</Badge>
          <span className="text-xl font-bold text-gray-700">{count}</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{desc}</p>
      </div>
      <button
        onClick={onLinkClick}
        className="text-left text-xs font-semibold text-navi hover:underline mt-4"
      >
        {link}
      </button>
    </Card>
  );
}
