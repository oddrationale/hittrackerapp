/**
 * Concept 3: "Forged"
 * Industrial brutalist — massive type, hard shadows, raw power.
 * Think: a warehouse gym poster meets Swiss International Style gone aggressive.
 *
 * Fonts: Anton (display, all-caps) + IBM Plex Mono (body)
 * Colors: #FFFFFF bg, #0A0A0A text, #FF2D20 red accent
 */

const routines = [
  { name: "FULL BODY A", count: 6 },
  { name: "UPPER BODY", count: 4 },
  { name: "LOWER BODY", count: 4 },
];

export function Concept3() {
  return (
    <div
      class="relative min-h-screen overflow-hidden bg-white text-[#0A0A0A]"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Diagonal red accent stripe — top right corner */}
      <div
        class="pointer-events-none absolute -top-4 -right-16 h-[200px] w-[100px] rotate-[25deg] bg-[#FF2D20] opacity-[0.06]"
        style={{ animation: "c-fade-in 1s ease-out 0.5s both" }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Top bar */}
        <header
          class="flex items-center justify-between border-b-[3px] border-[#0A0A0A] px-5 py-4"
          style={{ animation: "c-fade-in 0.5s ease-out both" }}
        >
          <span class="text-[11px] font-semibold tracking-[0.1em] uppercase">
            02.21.26
          </span>
          <span class="text-[11px] font-semibold tracking-[0.1em] text-[#FF2D20] uppercase">
            FRI
          </span>
        </header>

        {/* MASSIVE hero typography */}
        <section class="px-5 pt-10 pb-0">
          <h1
            class="text-[96px] leading-[0.85] font-normal tracking-[-0.02em]"
            style={{
              fontFamily: "'Anton', sans-serif",
              animation:
                "c-slam-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both",
            }}
          >
            HIT
          </h1>
          <div class="flex items-end gap-3">
            <h2
              class="-mt-1 text-[96px] leading-[0.85] font-normal tracking-[-0.02em]"
              style={{
                fontFamily: "'Anton', sans-serif",
                WebkitTextStroke: "2px #0A0A0A",
                color: "transparent",
                animation:
                  "c-slam-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
              }}
            >
              TRKR
            </h2>
            <div
              class="mb-3 h-3 w-3 bg-[#FF2D20]"
              style={{
                animation: "c-scale-in 0.4s ease-out 0.6s both",
              }}
            />
          </div>
        </section>

        {/* Red line */}
        <div
          class="mx-5 mt-6 h-[3px] origin-left bg-[#FF2D20]"
          style={{
            animation: "c-wipe-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both",
          }}
        />

        {/* Tagline */}
        <p
          class="px-5 pt-5 pb-8 text-[12px] leading-[1.6] font-medium tracking-[0.05em] uppercase"
          style={{ animation: "c-fade-in-up 0.6s ease-out 0.6s both" }}
        >
          High-intensity training.
          <br />
          No excuses. No compromises.
        </p>

        {/* START button */}
        <section
          class="px-5 pb-10"
          style={{ animation: "c-fade-in-up 0.6s ease-out 0.7s both" }}
        >
          <button
            class="group relative w-full bg-[#FF2D20] px-6 py-5 text-left transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#0A0A0A]"
            style={{ boxShadow: "4px 4px 0px #0A0A0A" }}
          >
            <div class="flex items-center justify-between">
              <div>
                <span
                  class="text-[28px] tracking-[-0.01em] text-white"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  START WORKOUT
                </span>
                <p class="mt-1 text-[11px] font-medium tracking-[0.05em] text-white/60 uppercase">
                  Freeform — choose as you go
                </p>
              </div>
              <span
                class="text-[32px] text-white/80 transition-transform duration-200 group-hover:translate-x-1"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                ›
              </span>
            </div>
          </button>
        </section>

        {/* ROUTINES header */}
        <div
          class="flex items-center gap-3 px-5 pb-4"
          style={{ animation: "c-fade-in 0.5s ease-out 0.8s both" }}
        >
          <span
            class="text-[14px] tracking-[0.1em]"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            ROUTINES
          </span>
          <div class="h-[2px] flex-1 bg-[#0A0A0A]" />
          <span class="text-[11px] font-medium text-[#FF2D20]">
            {routines.length}
          </span>
        </div>

        {/* Routine blocks */}
        <section class="space-y-0 px-5 pb-10">
          {routines.map((routine, i) => (
            <button
              key={routine.name}
              class="group flex w-full items-center justify-between border-[2px] border-b-0 border-[#0A0A0A] p-4 text-left transition-all duration-150 last:border-b-[2px] hover:bg-[#0A0A0A] hover:text-white active:scale-[0.99]"
              style={{
                animation: `c-fade-in-up 0.5s ease-out ${0.9 + i * 0.08}s both`,
              }}
            >
              <div class="flex items-center gap-4">
                <span class="text-[18px] font-bold text-[#FF2D20] tabular-nums group-hover:text-[#FF2D20]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    class="text-[16px] tracking-[0.03em]"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {routine.name}
                  </h3>
                  <p class="mt-0.5 text-[11px] font-medium tracking-[0.05em] uppercase opacity-40 group-hover:opacity-60">
                    {routine.count} exercises
                  </p>
                </div>
              </div>
              <span class="text-[20px] font-bold opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                →
              </span>
            </button>
          ))}
        </section>

        {/* Stats grid */}
        <section
          class="px-5 pb-10"
          style={{ animation: "c-fade-in-up 0.5s ease-out 1.15s both" }}
        >
          <div class="grid grid-cols-3 border-[2px] border-[#0A0A0A]">
            {[
              { value: "012", label: "TOTAL" },
              { value: "003", label: "STREAK" },
              { value: "048", label: "TUL %" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                class={`p-4 text-center ${i < 2 ? "border-r-[2px] border-[#0A0A0A]" : ""}`}
              >
                <p
                  class="text-[28px] tracking-[0.03em] tabular-nums"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p class="mt-1 text-[9px] font-semibold tracking-[0.15em] uppercase opacity-40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Last workout */}
        <div
          class="px-5 pb-8"
          style={{ animation: "c-fade-in 0.5s ease-out 1.25s both" }}
        >
          <div class="flex items-center gap-2 text-[11px] font-medium tracking-[0.05em] uppercase opacity-30">
            <div class="h-[2px] w-3 bg-[#FF2D20]" />
            <span>Last session: 2 days ago</span>
          </div>
        </div>

        {/* Bottom spacer */}
        <div class="h-20" />
      </div>

      {/* Bottom nav */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t-[3px] border-[#0A0A0A] bg-white">
        <div class="mx-auto grid max-w-lg grid-cols-4">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a
              key={label}
              href="#"
              class={`flex flex-col items-center py-4 text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors ${
                i === 0
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#0A0A0A]/30 hover:text-[#0A0A0A]/60"
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
