interface ResultCardProps {
  title: string;
  value: string;
  className?: string;
}

export function ResultCard({ title, value, className = "" }: ResultCardProps) {
  return (
    <div
      className={`p-4 bg-white rounded-lg border border-slate-300 shadow-sm ${className}`}
    >
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
