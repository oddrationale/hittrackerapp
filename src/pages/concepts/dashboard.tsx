/**
 * "Dashboard" — Stats-forward mobile app layout
 * A compact, data-driven home screen for tracking workouts.
 * Stat grid at top, primary CTA, horizontal routine cards, recent activity.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

const routines = [
  { name: "Full Body A", count: 6 },
  { name: "Upper Body", count: 4 },
  { name: "Lower Body", count: 4 },
];

const stats = [
  { value: "12", label: "Sessions" },
  { value: "3", label: "Wk Streak" },
  { value: "48%", label: "Avg TUL" },
];

const recentWorkouts = [
  { name: "Full Body A", date: "Wed 2/19", duration: "42 min" },
  { name: "Upper Body", date: "Mon 2/17", duration: "38 min" },
];

export function Dashboard() {
  return (
    <div
      class="relative min-h-screen bg-[#F7F5F0] text-[#1A1A1A]"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      {/* Subtle paper texture */}
      <div
        class="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Sticky compact header */}
        <header
          class="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-xl"
          style={{ animation: "c-fade-in 0.6s ease-out both" }}
        >
          <div class="flex items-center justify-between px-5 py-3">
            <span
              class="text-[18px] tracking-[0.03em]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Hit Tracker
            </span>
            <span class="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-40">
              Feb 21, 2026
            </span>
          </div>
          <div class="mx-5 h-[2px] bg-[#1A1A1A]" />
        </header>

        {/* Stat grid */}
        <section
          class="px-5 pt-5 pb-5"
          style={{ animation: "c-fade-in-up 0.6s ease-out 0.1s both" }}
        >
          <div class="grid grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                class={`py-2 ${i > 0 ? "border-l border-[#1A1A1A]/[0.08] pl-4" : ""}`}
              >
                <p
                  class="text-[28px] leading-none tracking-[0.02em]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p class="mt-1 text-[10px] font-medium tracking-[0.05em] uppercase opacity-30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rule line */}
        <div
          class="mx-5 h-px bg-[#1A1A1A]/15"
          style={{ animation: "c-fade-in 0.6s ease-out 0.2s both" }}
        />

        {/* Primary CTA */}
        <section class="px-5 pt-6 pb-6">
          <p
            class="mb-3 text-[9px] font-semibold tracking-[0.25em] text-[#0047FF] uppercase"
            style={{ animation: "c-fade-in 0.6s ease-out 0.25s both" }}
          >
            Today&apos;s Session
          </p>
          <button
            class="group w-full bg-[#1A1A1A] px-5 py-4 text-left transition-all duration-200 hover:bg-[#0047FF] active:scale-[0.99]"
            style={{ animation: "c-fade-in-up 0.6s ease-out 0.3s both" }}
          >
            <span
              class="text-[22px] tracking-[0.03em] text-[#F7F5F0]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Start Workout
            </span>
            <p class="mt-1 text-[11px] font-light text-[#F7F5F0]/50">
              Full Body A &middot; 6 exercises
            </p>
          </button>
          <p
            class="mt-3 text-[11px] font-light opacity-30"
            style={{ animation: "c-fade-in 0.6s ease-out 0.35s both" }}
          >
            Last session: 2 days ago
          </p>
        </section>

        {/* Rule line */}
        <div
          class="mx-5 h-px bg-[#1A1A1A]/15"
          style={{ animation: "c-fade-in 0.6s ease-out 0.4s both" }}
        />

        {/* Routine cards — horizontal scroll */}
        <section class="pt-6 pb-6">
          <div
            class="mb-4 flex items-baseline justify-between px-5"
            style={{ animation: "c-fade-in 0.6s ease-out 0.45s both" }}
          >
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Routines
            </h2>
            <span class="text-[11px] font-medium text-[#0047FF]">
              Edit &rarr;
            </span>
          </div>

          <div
            class="flex gap-3 overflow-x-auto px-5 pb-1"
            style={{ animation: "c-fade-in-up 0.6s ease-out 0.5s both" }}
          >
            {routines.map((routine) => (
              <button
                key={routine.name}
                class="flex-shrink-0 border border-[#1A1A1A]/[0.08] px-4 py-3 text-left transition-colors hover:bg-[#1A1A1A]/[0.02]"
                style={{ width: "130px" }}
              >
                <span
                  class="text-[18px] leading-tight tracking-[0.02em]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {routine.name}
                </span>
                <p class="mt-1 text-[10px] font-light opacity-30">
                  {routine.count} exercises
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Rule line */}
        <div
          class="mx-5 h-px bg-[#1A1A1A]/15"
          style={{ animation: "c-fade-in 0.6s ease-out 0.6s both" }}
        />

        {/* Recent activity */}
        <section class="px-5 pt-6 pb-6">
          <div
            class="mb-4 flex items-baseline justify-between"
            style={{ animation: "c-fade-in 0.6s ease-out 0.65s both" }}
          >
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Recent
            </h2>
          </div>

          <div class="space-y-0">
            {recentWorkouts.map((workout, i) => (
              <div
                key={workout.name}
                class="flex items-center justify-between border-b border-[#1A1A1A]/[0.08] py-3 first:border-t"
                style={{
                  animation: `c-fade-in-up 0.5s ease-out ${0.7 + i * 0.08}s both`,
                }}
              >
                <div>
                  <span
                    class="text-[16px] tracking-[0.02em]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {workout.name}
                  </span>
                  <p class="mt-0.5 text-[10px] font-light opacity-30">
                    {workout.date}
                  </p>
                </div>
                <span class="text-[11px] font-light opacity-30">
                  {workout.duration}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom spacer */}
        <div class="h-20" />
      </div>

      {/* Bottom tab bar */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-[#1A1A1A]/10 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-3">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a
              key={label}
              href="#"
              class={`flex flex-col items-center py-1 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                i === 0
                  ? "text-[#0047FF]"
                  : "text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50"
              }`}
            >
              {i === 0 && <div class="mb-1 h-[2px] w-4 bg-[#0047FF]" />}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
