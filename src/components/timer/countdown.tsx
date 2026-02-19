interface CountdownProps {
  remaining: number;
}

export function Countdown({ remaining }: CountdownProps) {
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div class="text-center">
        <div class="animate-pulse text-9xl font-bold text-white">
          {remaining}
        </div>
        <p class="mt-4 text-xl text-gray-300">Get ready...</p>
      </div>
    </div>
  );
}
