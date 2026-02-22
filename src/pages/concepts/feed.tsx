/**
 * "Feed" — Action-first mobile app layout
 * The workout CTA dominates the viewport, with a recent activity feed below.
 * Same Press design language: Bebas Neue + Barlow, rule lines, editorial warmth.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

const recentActivity = [
  {
    name: "Full Body A",
    timeAgo: "2 days ago",
    duration: "42 min",
    exercises: 6,
  },
  {
    name: "Upper Body",
    timeAgo: "4 days ago",
    duration: "38 min",
    exercises: 4,
  },
  {
    name: "Lower Body",
    timeAgo: "6 days ago",
    duration: "35 min",
    exercises: 4,
  },
];

const stats = [
  { value: "12", label: "Sessions" },
  { value: "3", label: "Wk Streak" },
  { value: "48%", label: "Avg TUL" },
];

export function Feed() {
  return (
    <div
      class="relative min-h-screen bg-[#F7F5F0] text-[#1A1A1A]"
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      {/* Paper texture overlay */}
      <div
        class="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Sticky header */}
        <header
          class="sticky top-0 z-30 border-b-[2px] border-[#1A1A1A] bg-[#F7F5F0]/90 px-5 pt-10 pb-3 backdrop-blur-xl"
          style={{ animation: "c-fade-in 0.6s ease-out both" }}
        >
          <div class="flex items-center justify-between">
            <span
              class="text-[22px] tracking-[0.03em]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Hit Tracker
            </span>
            <span class="text-[10px] font-semibold tracking-[0.2em] text-[#0047FF] uppercase">
              No. 12
            </span>
          </div>
        </header>

        {/* Dateline */}
        <div
          class="px-5 pt-4 pb-3"
          style={{ animation: "c-fade-in 0.6s ease-out 0.1s both" }}
        >
          <span class="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-40">
            Friday, February 21, 2026
          </span>
        </div>

        {/* Hero CTA */}
        <section
          class="mx-5 bg-[#1A1A1A] py-10 text-center"
          style={{ animation: "c-fade-in-up 0.7s ease-out 0.2s both" }}
        >
          <h1
            class="text-[36px] tracking-[0.03em] text-[#F7F5F0]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Start Workout
          </h1>
          <p
            class="mt-2 text-[14px] tracking-[0.02em] text-[#F7F5F0]/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Full Body A
          </p>
          <p class="mt-1 text-[11px] font-light text-[#F7F5F0]/35">
            6 exercises
          </p>
          <div class="mt-6 flex items-center justify-center gap-3 text-[11px] font-light text-[#F7F5F0]/25">
            <span>←</span>
            <span
              class="text-[12px] tracking-[0.02em] text-[#F7F5F0]/40"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Full Body A
            </span>
            <span>→</span>
          </div>
        </section>

        {/* Recent Activity */}
        <section class="px-5 pt-6 pb-6">
          <div
            class="mb-5 flex items-baseline justify-between"
            style={{ animation: "c-fade-in 0.6s ease-out 0.4s both" }}
          >
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Recent Activity
            </h2>
          </div>

          <div class="space-y-0">
            {recentActivity.map((activity, i) => (
              <button
                key={activity.name}
                class="group flex w-full items-center justify-between border-b border-[#1A1A1A]/[0.08] py-4 text-left transition-colors first:border-t hover:bg-[#1A1A1A]/[0.02]"
                style={{
                  animation: `c-fade-in-up 0.5s ease-out ${0.5 + i * 0.08}s both`,
                }}
              >
                <div>
                  <span
                    class="text-[18px] tracking-[0.02em]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {activity.name}
                  </span>
                  <p class="mt-0.5 text-[11px] font-light opacity-30">
                    {activity.timeAgo} · {activity.duration} ·{" "}
                    {activity.exercises} ex.
                  </p>
                </div>
                <span class="text-[14px] opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#0047FF] group-hover:opacity-80">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Compact stat bar */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        <section
          class="px-5 pt-4 pb-5"
          style={{ animation: "c-fade-in 0.6s ease-out 0.8s both" }}
        >
          <p class="mb-3 text-[9px] font-semibold tracking-[0.25em] uppercase opacity-30">
            This Week
          </p>
          <div class="grid grid-cols-3 gap-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                class={`text-center ${i > 0 ? "border-l border-[#1A1A1A]/[0.08]" : ""}`}
              >
                <p
                  class="text-[22px] leading-none tracking-[0.02em] tabular-nums"
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

        {/* Heavy rule + footer tagline */}
        <div class="mx-5 h-[2px] bg-[#1A1A1A]" />

        <div
          class="px-5 py-4 text-center"
          style={{ animation: "c-fade-in 0.6s ease-out 1.0s both" }}
        >
          <p class="text-[9px] font-medium tracking-[0.3em] uppercase opacity-20">
            Track · Improve · Repeat
          </p>
        </div>

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
