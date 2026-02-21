/**
 * Concept 1: "Midnight Studio"
 * Dark luxury editorial — gold accents on deep black with film grain.
 * Think: exclusive members-only training studio meets Diptyque branding.
 *
 * Fonts: Cormorant Garamond (display serif) + Questrial (body sans)
 * Colors: #0A0A0A bg, #F5F0E8 cream text, #C9A96E gold accent
 */

const routines = [
  { name: "Full Body A", count: 6, lastUsed: "3 days ago" },
  { name: "Upper Body", count: 4, lastUsed: "5 days ago" },
  { name: "Lower Body", count: 4, lastUsed: "1 week ago" },
];

const stats = [
  { value: "12", label: "Workouts" },
  { value: "3", label: "Week Streak" },
  { value: "48%", label: "Avg TUL" },
];

function GrainOverlay() {
  return (
    <div
      class="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

export function Concept1() {
  return (
    <div
      class="relative min-h-screen bg-[#0A0A0A] text-[#F5F0E8]"
      style={{ fontFamily: "'Questrial', sans-serif" }}
    >
      <GrainOverlay />

      {/* Ambient glow — subtle warm light at top */}
      <div
        class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
        }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Date header */}
        <header
          class="flex items-center justify-between px-7 pt-12 pb-5"
          style={{ animation: "c-fade-in 0.8s ease-out both" }}
        >
          <span class="text-[11px] tracking-[0.3em] uppercase opacity-40">
            Feb 21, 2026
          </span>
          <span class="text-[11px] tracking-[0.3em] uppercase opacity-40">
            Friday
          </span>
        </header>

        {/* Gold gradient divider */}
        <div
          class="mx-7 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent"
          style={{ animation: "c-fade-in 1s ease-out 0.1s both" }}
        />

        {/* Hero section */}
        <section class="px-7 pt-16 pb-12 text-center">
          <p
            class="mb-5 text-[11px] tracking-[0.5em] text-[#C9A96E] uppercase"
            style={{ animation: "c-fade-in-up 0.8s ease-out 0.2s both" }}
          >
            Welcome back
          </p>
          <h1
            class="mb-6 text-[58px] leading-[1.02] font-light tracking-[0.02em]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              animation: "c-fade-in-up 0.9s ease-out 0.35s both",
            }}
          >
            HIT
            <br />
            Tracker
          </h1>
          <p
            class="mx-auto max-w-[260px] text-[13px] leading-[1.7] opacity-45"
            style={{ animation: "c-fade-in-up 0.8s ease-out 0.5s both" }}
          >
            High-intensity training,
            <br />
            meticulously tracked.
          </p>
        </section>

        {/* Begin Workout button */}
        <section
          class="px-7 pb-12"
          style={{ animation: "c-fade-in-up 0.8s ease-out 0.65s both" }}
        >
          <button class="group relative w-full overflow-hidden border border-[#C9A96E]/25 py-5 text-center transition-all duration-500 hover:border-[#C9A96E]/50 hover:bg-[#C9A96E]/[0.05] active:scale-[0.985]">
            {/* Shimmer effect on hover */}
            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C9A96E]/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span class="relative text-[11px] tracking-[0.35em] text-[#C9A96E] uppercase">
              Begin Workout
            </span>
          </button>
        </section>

        {/* Routines divider */}
        <div
          class="flex items-center gap-4 px-7 pb-7"
          style={{ animation: "c-fade-in 0.8s ease-out 0.75s both" }}
        >
          <div class="h-px flex-1 bg-white/[0.06]" />
          <span class="text-[9px] tracking-[0.4em] uppercase opacity-20">
            Routines
          </span>
          <div class="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Routine cards */}
        <section class="space-y-3 px-7 pb-12">
          {routines.map((routine, i) => (
            <button
              key={routine.name}
              class="group w-full border border-white/[0.04] bg-white/[0.015] p-5 text-left transition-all duration-400 hover:border-[#C9A96E]/15 hover:bg-white/[0.025] active:scale-[0.99]"
              style={{
                animation: `c-fade-in-up 0.7s ease-out ${0.85 + i * 0.1}s both`,
              }}
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-[17px] font-normal tracking-[0.01em]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {routine.name}
                  </h3>
                  <div class="mt-2 flex items-center gap-3">
                    <span class="text-[11px] tracking-wide opacity-30">
                      {routine.count} exercises
                    </span>
                    <span class="text-[11px] opacity-15">·</span>
                    <span class="text-[11px] tracking-wide opacity-20">
                      {routine.lastUsed}
                    </span>
                  </div>
                </div>
                <span class="text-[14px] text-[#C9A96E]/30 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#C9A96E]/70">
                  →
                </span>
              </div>
            </button>
          ))}
        </section>

        {/* Divider */}
        <div class="mx-7 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Stats strip */}
        <section
          class="grid grid-cols-3 gap-4 px-7 py-10 text-center"
          style={{ animation: "c-fade-in 0.8s ease-out 1.15s both" }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                class="text-[30px] font-light tracking-[0.02em]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {stat.value}
              </p>
              <p class="mt-2 text-[9px] tracking-[0.25em] uppercase opacity-25">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Last workout indicator */}
        <div
          class="px-7 pb-8 text-center"
          style={{ animation: "c-fade-in 0.8s ease-out 1.3s both" }}
        >
          <p class="text-[11px] tracking-[0.15em] uppercase opacity-20">
            Last session · 2 days ago
          </p>
        </div>

        {/* Bottom spacer */}
        <div class="h-20" />
      </div>

      {/* Bottom nav */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-white/[0.04] bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-4">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a
              key={label}
              href="#"
              class={`flex flex-col items-center text-[10px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                i === 0 ? "text-[#C9A96E]" : "text-white/20 hover:text-white/35"
              }`}
            >
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
