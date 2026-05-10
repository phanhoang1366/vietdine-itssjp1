"use client";

interface FilterChip {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
}

interface FilterChipsSectionProps {
  onFilterChange?: (filterId: string) => void;
  activeFilter?: string;
}

export default function FilterChipsSection({
  onFilterChange,
  activeFilter = "rating",
}: FilterChipsSectionProps) {
  const chips: FilterChip[] = [
    {
      id: "rating",
      label: "評価",
      icon: "star",
      isActive: activeFilter === "rating",
    },
    {
      id: "distance",
      label: "距離",
      icon: "distance",
      isActive: activeFilter === "distance",
    },
    {
      id: "availability",
      label: "空席状況",
      icon: "event_seat",
      isActive: activeFilter === "availability",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onFilterChange?.(chip.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap ${
            chip.isActive
              ? "bg-tertiary-container text-on-tertiary-container"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          <span className="material-symbols-outlined text-sm">{chip.icon}</span>
          <span>{chip.label}</span>
        </button>
      ))}

      {/* Filter button on the right */}
      <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold hover:bg-surface-container-highest transition-all ml-auto whitespace-nowrap">
        <span className="material-symbols-outlined text-sm">tune</span>
        <span>フィルター</span>
      </button>
    </div>
  );
}
