import { useLocation } from "preact-iso";

const tabs = [
  { label: "Workout", path: "/" },
  { label: "History", path: "/history" },
  { label: "Stats", path: "/stats" },
  { label: "Settings", path: "/settings" },
];

export function TabBar() {
  const { path } = useLocation();

  return (
    <nav class="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white">
      <div class="grid grid-cols-4">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? path === "/" || path.startsWith("/workout")
              : path.startsWith(tab.path);
          return (
            <a
              key={tab.path}
              href={tab.path}
              class={`flex flex-col items-center py-2 text-xs ${
                isActive ? "font-semibold text-blue-600" : "text-gray-500"
              }`}
            >
              <span class="mt-1">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
