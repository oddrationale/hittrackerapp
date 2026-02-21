/**
 * Concept 5: "Press"
 * Editorial magazine — bold typography, rule lines, structured layout.
 * Think: a fitness magazine front page meets Swiss design precision.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

const routines = [
  { name: "Full Body A", count: 6 },
  { name: "Upper Body", count: 4 },
  { name: "Lower Body", count: 4 },
];

export function Concept5() {
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
        {/* Dateline header */}
        <header
          class="px-5 pt-10 pb-3"
          style={{ animation: "c-fade-in 0.6s ease-out both" }}
        >
          <div class="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] uppercase opacity-40">
            <span>Friday, February 21, 2026</span>
            <span class="text-[#0047FF] opacity-100">No. 12</span>
          </div>
        </header>

        {/* Rule line */}
        <div
          class="mx-5 h-px bg-[#1A1A1A]/15"
          style={{ animation: "c-fade-in 0.6s ease-out 0.05s both" }}
        />

        {/* Masthead */}
        <section class="px-5 pt-6 pb-2">
          <h1
            class="text-[76px] leading-[0.92] font-normal tracking-[0.04em]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              animation: "c-fade-in-up 0.7s ease-out 0.15s both",
            }}
          >
            HIT
            <br />
            TRACKER
          </h1>
          <p
            class="mt-3 text-[13px] leading-[1.6] font-light tracking-[0.01em] opacity-45"
            style={{ animation: "c-fade-in-up 0.6s ease-out 0.3s both" }}
          >
            Your high-intensity training companion.
            <br />
            Every rep recorded. Every second counted.
          </p>
        </section>

        {/* Thick rule */}
        <div
          class="mx-5 mt-5 h-[2px] bg-[#1A1A1A]"
          style={{ animation: "c-fade-in 0.6s ease-out 0.35s both" }}
        />

        {/* Two-column section: Action + Stats sidebar */}
        <section class="grid grid-cols-[1fr_auto] gap-0 px-5 pt-6 pb-6">
          {/* Left column: Start workout */}
          <div
            class="pr-5"
            style={{ animation: "c-fade-in-up 0.6s ease-out 0.4s both" }}
          >
            <p class="mb-3 text-[9px] font-semibold tracking-[0.25em] text-[#0047FF] uppercase">
              Today&apos;s Session
            </p>
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
            <p class="mt-3 text-[11px] font-light opacity-30">
              Last session: 2 days ago
            </p>
          </div>

          {/* Right column: Stats sidebar */}
          <div
            class="border-l border-[#1A1A1A]/10 pl-5"
            style={{ animation: "c-fade-in-up 0.6s ease-out 0.5s both" }}
          >
            <p class="mb-4 text-[9px] font-semibold tracking-[0.25em] uppercase opacity-30">
              Stats
            </p>
            {[
              { value: "12", label: "Sessions" },
              { value: "3", label: "Wk streak" },
              { value: "48%", label: "Avg TUL" },
            ].map((stat, i) => (
              <div key={stat.label} class={i > 0 ? "mt-4" : ""}>
                <p
                  class="text-[28px] leading-none tracking-[0.02em]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p class="mt-0.5 text-[10px] font-medium tracking-[0.05em] uppercase opacity-30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rule line */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Routines section */}
        <section class="px-5 pt-6 pb-8">
          <div
            class="mb-5 flex items-baseline justify-between"
            style={{ animation: "c-fade-in 0.6s ease-out 0.6s both" }}
          >
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Routines
            </h2>
            <span class="text-[11px] font-medium text-[#0047FF]">Edit →</span>
          </div>

          <div class="space-y-0">
            {routines.map((routine, i) => (
              <button
                key={routine.name}
                class="group flex w-full items-center justify-between border-b border-[#1A1A1A]/[0.08] py-4 text-left transition-colors first:border-t hover:bg-[#1A1A1A]/[0.02]"
                style={{
                  animation: `c-fade-in-up 0.5s ease-out ${0.7 + i * 0.08}s both`,
                }}
              >
                <div class="flex items-baseline gap-3">
                  <span
                    class="text-[22px] tracking-[0.02em]"
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
        </section>

        {/* Pull quote */}
        <section
          class="px-5 pb-10"
          style={{ animation: "c-fade-in 0.6s ease-out 1s both" }}
        >
          <div class="border-l-[3px] border-[#0047FF] py-1 pl-5">
            <p class="text-[15px] leading-[1.7] font-light italic opacity-40">
              "The resistance that you fight physically in the gym and the
              resistance that you fight in life can only build a strong
              character."
            </p>
            <p class="mt-2 text-[10px] font-semibold tracking-[0.15em] uppercase opacity-25">
              — Arnold Schwarzenegger
            </p>
          </div>
        </section>

        {/* Footer rule */}
        <div class="mx-5 h-[2px] bg-[#1A1A1A]" />

        {/* Footer info */}
        <div
          class="px-5 py-4 text-center"
          style={{ animation: "c-fade-in 0.6s ease-out 1.1s both" }}
        >
          <p class="text-[9px] font-medium tracking-[0.3em] uppercase opacity-20">
            Track · Improve · Repeat
          </p>
        </div>

        {/* Bottom spacer */}
        <div class="h-20" />
      </div>

      {/* Bottom nav — editorial clean */}
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
