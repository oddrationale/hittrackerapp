/**
 * "Compact" — Magazine-app hybrid layout
 * Closest to the original Press but tightened into app proportions.
 * Sticky header, card zones, inline stats, dot-indicator tab bar.
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

export function Compact() {
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
        {/* Sticky header: "Hit Tracker" left, "No. 12" right */}
        <header
          class="sticky top-0 z-30 border-b-[2px] border-[#1A1A1A] bg-[#F7F5F0]/90 backdrop-blur-xl"
          style={{ animation: "c-fade-in 0.6s ease-out both" }}
        >
          <div class="flex items-center justify-between px-5 py-3">
            <span
              class="text-[24px] leading-none tracking-[0.03em]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Hit Tracker
            </span>
            <span class="text-[11px] font-semibold tracking-[0.2em] text-[#0047FF] uppercase">
              No. 12
            </span>
          </div>
        </header>

        {/* Dateline */}
        <div
          class="px-5 pt-4 pb-3"
          style={{ animation: "c-fade-in 0.6s ease-out 0.1s both" }}
        >
          <p class="text-[10px] font-semibold tracking-[0.25em] uppercase opacity-40">
            Friday, February 21, 2026
          </p>
        </div>

        {/* Action card zone */}
        <div
          class="mx-5 border border-[#1A1A1A]/[0.08]"
          style={{ animation: "c-fade-in-up 0.6s ease-out 0.25s both" }}
        >
          {/* "Today's Session" section label */}
          <div class="px-4 pt-4 pb-3">
            <p class="text-[9px] font-semibold tracking-[0.25em] text-[#0047FF] uppercase">
              Today&apos;s Session
            </p>
          </div>

          {/* Start Workout CTA */}
          <div class="px-4">
            <button class="group w-full bg-[#1A1A1A] px-5 py-4 text-left transition-all duration-200 hover:bg-[#0047FF] active:scale-[0.99]">
              <span
                class="text-[22px] tracking-[0.03em] text-[#F7F5F0]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Start Workout
              </span>
              <p class="mt-1 text-[11px] font-light text-[#F7F5F0]/50">
                Freeform session
              </p>
            </button>
          </div>

          {/* Last session metadata */}
          <div class="px-4 pt-3 pb-4">
            <p class="text-[11px] font-light opacity-30">
              Last session: 2 days ago
            </p>
          </div>

          {/* Thin rule separator inside card */}
          <div class="mx-4 h-px bg-[#1A1A1A]/[0.08]" />

          {/* Inline 3-up stat row */}
          <div class="grid grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                class={`px-4 py-4 text-center${i < stats.length - 1 ? " border-r border-[#1A1A1A]/[0.08]" : ""}`}
              >
                <p
                  class="text-[22px] leading-none tracking-[0.02em]"
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
        </div>

        {/* Spacer between card zones */}
        <div class="h-4" />

        {/* Routines card zone */}
        <div
          class="mx-5 border border-[#1A1A1A]/[0.08]"
          style={{ animation: "c-fade-in-up 0.6s ease-out 0.45s both" }}
        >
          {/* Routines header with Edit ghost button */}
          <div class="flex items-center justify-between px-4 pt-4 pb-3">
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Routines
            </h2>
            <span class="text-[11px] font-medium text-[#0047FF]">Edit →</span>
          </div>

          {/* Routine list rows */}
          <div>
            {routines.map((routine, i) => (
              <button
                key={routine.name}
                class="group flex w-full items-center justify-between border-t border-[#1A1A1A]/[0.08] px-4 py-4 text-left transition-colors hover:bg-[#1A1A1A]/[0.02]"
                style={{
                  animation: `c-fade-in-up 0.5s ease-out ${0.55 + i * 0.08}s both`,
                }}
              >
                <div class="flex items-baseline gap-3">
                  <span
                    class="text-[20px] tracking-[0.02em]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {routine.name}
                  </span>
                  <span class="text-[11px] font-light opacity-30">
                    {routine.count} ex.
                  </span>
                </div>
                <span class="text-[14px] opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#0047FF] group-hover:opacity-80">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pull quote — compact version */}
        <section
          class="px-5 pt-6 pb-6"
          style={{ animation: "c-fade-in 0.6s ease-out 0.85s both" }}
        >
          <div class="border-l-[3px] border-[#0047FF] py-1 pl-5">
            <p class="text-[13px] leading-[1.7] font-light italic opacity-35">
              "The resistance that you fight physically in the gym and the
              resistance that you fight in life can only build a strong
              character."
            </p>
            <p class="mt-2 text-[10px] font-semibold tracking-[0.15em] uppercase opacity-25">
              — Arnold Schwarzenegger
            </p>
          </div>
        </section>

        {/* Bottom spacer */}
        <div class="h-20" />
      </div>

      {/* Bottom tab bar — frosted glass with dot indicators */}
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
              {i === 0 && (
                <div class="mb-1 h-[5px] w-[5px] rounded-full bg-[#0047FF]" />
              )}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
