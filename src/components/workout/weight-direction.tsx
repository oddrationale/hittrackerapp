import type { WeightDirection } from "../../types/index.ts";

interface WeightDirectionProps {
  value: WeightDirection;
  onChange: (direction: WeightDirection) => void;
}

const directions: {
  value: WeightDirection;
  label: string;
  icon: string;
  activeClass: string;
}[] = [
  {
    value: "increase",
    label: "Increase",
    icon: "\u2191",
    activeClass: "bg-green-600 text-white",
  },
  {
    value: "maintain",
    label: "Maintain",
    icon: "=",
    activeClass: "bg-gray-600 text-white",
  },
  {
    value: "decrease",
    label: "Decrease",
    icon: "\u2193",
    activeClass: "bg-red-600 text-white",
  },
];

export function WeightDirectionSelector({
  value,
  onChange,
}: WeightDirectionProps) {
  return (
    <div class="flex gap-2">
      {directions.map((dir) => (
        <button
          key={dir.value}
          onClick={() => onChange(dir.value)}
          class={`flex flex-1 flex-col items-center rounded-lg py-2 text-sm font-medium transition-colors ${
            value === dir.value ? dir.activeClass : "bg-gray-100 text-gray-700"
          }`}
        >
          <span class="text-lg">{dir.icon}</span>
          <span>{dir.label}</span>
        </button>
      ))}
    </div>
  );
}
