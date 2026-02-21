/**
 * Concept 4: "Aurora"
 * Gradient glass modern — floating glass cards over animated gradient cosmos.
 * Think: premium app store design meets Northern Lights.
 *
 * Fonts: Outfit (display) + Sora (body)
 * Colors: deep navy gradient bg, violet-to-pink accents, frosted glass cards
 */

const routines = [
  { name: "Full Body A", count: 6, icon: "⬡" },
  { name: "Upper Body", count: 4, icon: "△" },
  { name: "Lower Body", count: 4, icon: "◇" },
];

function GradientOrbs() {
  return (
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Primary violet orb */}
      <div
        class="absolute top-[-10%] left-[-15%] h-[400px] w-[400px] rounded-full opacity-30 blur-[80px]"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
          animation: "c-float-1 20s ease-in-out infinite",
        }}
      />
      {/* Pink orb */}
      <div
        class="absolute top-[30%] right-[-20%] h-[350px] w-[350px] rounded-full opacity-25 blur-[80px]"
        style={{
          background: "radial-gradient(circle, #EC4899 0%, transparent 70%)",
          animation: "c-float-2 25s ease-in-out infinite",
        }}
      />
      {/* Deep blue orb */}
      <div
        class="absolute bottom-[-10%] left-[20%] h-[300px] w-[300px] rounded-full opacity-20 blur-[80px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          animation: "c-float-3 22s ease-in-out infinite",
        }}
      />
      {/* Subtle warm accent */}
      <div
        class="absolute top-[60%] right-[10%] h-[200px] w-[200px] rounded-full opacity-10 blur-[60px]"
        style={{
          background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
          animation: "c-float-1 18s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

function GlassCard({
  children,
  class: className = "",
  style: inlineStyle = {},
}: {
  children: preact.ComponentChildren;
  class?: string;
  style?: Record<string, string>;
}) {
  return (
    <div
      class={`rounded-2xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-xl ${className}`}
      style={inlineStyle}
    >
      {children}
    </div>
  );
}

export function Concept4() {
  return (
    <div
      class="relative min-h-screen text-[#F8FAFC]"
      style={{
        fontFamily: "'Sora', sans-serif",
        background:
          "linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
      }}
    >
      <GradientOrbs />

      {/* Subtle star field / dot pattern */}
      <div
        class="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 50px 160px, white, transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(1px 1px at 160px 120px, white, transparent)",
          backgroundSize: "200px 200px",
        }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Top bar */}
        <header
          class="flex items-center justify-between px-6 pt-10 pb-4"
          style={{ animation: "c-fade-in 0.7s ease-out both" }}
        >
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              }}
            >
              <span
                class="text-[13px] font-bold text-white"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                H
              </span>
            </div>
            <span class="text-[13px] font-medium opacity-50">HIT Tracker</span>
          </div>
          <div class="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-light opacity-40">
            <div class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Fri, Feb 21
          </div>
        </header>

        {/* Hero */}
        <section class="px-6 pt-12 pb-10 text-center">
          <p
            class="mb-4 text-[12px] font-light tracking-[0.3em] uppercase opacity-40"
            style={{ animation: "c-fade-in-up 0.7s ease-out 0.15s both" }}
          >
            Welcome back
          </p>
          <h1
            class="mb-4 text-[42px] leading-[1.1] font-bold tracking-[-0.02em]"
            style={{
              fontFamily: "'Outfit', sans-serif",
              animation: "c-fade-in-up 0.8s ease-out 0.25s both",
            }}
          >
            Time to{" "}
            <span
              class="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #A78BFA, #EC4899, #F59E0B)",
                WebkitBackgroundClip: "text",
              }}
            >
              push limits
            </span>
          </h1>
          <p
            class="mx-auto max-w-[280px] text-[14px] leading-[1.7] font-light opacity-40"
            style={{ animation: "c-fade-in-up 0.7s ease-out 0.4s both" }}
          >
            Track every rep, every second under load.
            <br />
            Your progress, visualized.
          </p>
        </section>

        {/* Start workout button */}
        <section
          class="px-6 pb-10"
          style={{ animation: "c-fade-in-up 0.7s ease-out 0.5s both" }}
        >
          <button
            class="group relative w-full overflow-hidden rounded-2xl px-6 py-5 text-left transition-all duration-400 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
            }}
          >
            {/* Shimmer overlay */}
            <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <div class="relative flex items-center justify-between">
              <div>
                <p
                  class="text-[18px] font-semibold text-white"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Start Workout
                </p>
                <p class="mt-1 text-[13px] font-light text-white/60">
                  Freeform — choose exercises as you go
                </p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                <span class="text-lg">→</span>
              </div>
            </div>
          </button>
        </section>

        {/* Stats row */}
        <section
          class="px-6 pb-10"
          style={{ animation: "c-fade-in-up 0.7s ease-out 0.6s both" }}
        >
          <GlassCard class="grid grid-cols-3 divide-x divide-white/[0.06] p-1">
            {[
              { value: "12", label: "Workouts", color: "#A78BFA" },
              { value: "3", label: "Wk Streak", color: "#34D399" },
              { value: "48%", label: "Avg TUL", color: "#F59E0B" },
            ].map((stat) => (
              <div key={stat.label} class="py-4 text-center">
                <p
                  class="text-[24px] font-bold"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </p>
                <p class="mt-1 text-[10px] font-light tracking-[0.1em] uppercase opacity-35">
                  {stat.label}
                </p>
              </div>
            ))}
          </GlassCard>
        </section>

        {/* Routines section */}
        <section class="px-6 pb-12">
          <h2
            class="mb-4 text-[12px] font-medium tracking-[0.15em] uppercase opacity-35"
            style={{ animation: "c-fade-in 0.6s ease-out 0.7s both" }}
          >
            Routines
          </h2>
          <div class="space-y-3">
            {routines.map((routine, i) => (
              <GlassCard
                key={routine.name}
                class="group cursor-pointer p-4 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.08]"
                style={{
                  animation: `c-fade-in-up 0.6s ease-out ${0.8 + i * 0.1}s both`,
                }}
              >
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl text-[18px]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))",
                    }}
                  >
                    {routine.icon}
                  </div>
                  <div class="flex-1">
                    <h3
                      class="text-[15px] font-semibold"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {routine.name}
                    </h3>
                    <p class="mt-0.5 text-[12px] font-light opacity-35">
                      {routine.count} exercises
                    </p>
                  </div>
                  <span class="text-sm opacity-20 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-50">
                    →
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Last session */}
        <div
          class="px-6 pb-8 text-center"
          style={{ animation: "c-fade-in 0.6s ease-out 1.1s both" }}
        >
          <p class="text-[12px] font-light opacity-20">
            Last session · 2 days ago
          </p>
        </div>

        {/* Bottom spacer */}
        <div class="h-24" />
      </div>

      {/* Bottom nav — frosted glass */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-white/[0.06] bg-[#0F172A]/70 backdrop-blur-2xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-3">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a
              key={label}
              href="#"
              class={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors ${
                i === 0 ? "text-[#A78BFA]" : "text-white/20 hover:text-white/35"
              }`}
            >
              {i === 0 && (
                <div
                  class="h-0.5 w-4 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #7C3AED, #EC4899)",
                  }}
                />
              )}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
