export function SampleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-amber-500 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
      {label}
    </span>
  );
}
