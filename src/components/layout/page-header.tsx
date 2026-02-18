interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <header class="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
      <div class="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            class="mr-3 p-1 text-gray-600"
            aria-label="Go back"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h1 class="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
