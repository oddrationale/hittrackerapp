/**
 * Concept 2: "Warm Clay"
 * Organic minimalism — earth tones, soft shapes, generous whitespace.
 * Think: Kinfolk magazine meets a wellness retreat app.
 *
 * Fonts: Instrument Serif (display) + DM Sans (body)
 * Colors: #FAF6F1 warm cream bg, #2C2420 warm brown text, #C4704D terracotta
 */

const routines = [
  { name: "Full Body A", count: 6, emoji: "◯" },
  { name: "Upper Body", count: 4, emoji: "△" },
  { name: "Lower Body", count: 4, emoji: "□" },
];

const stats = [
  { value: "12", label: "sessions" },
  { value: "3wk", label: "streak" },
  { value: "2d", label: "last session" },
];

export function Concept2() {
  return (
    <div
      class="relative min-h-screen overflow-hidden bg-[#FAF6F1] text-[#2C2420]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Decorative background blobs */}
      <div
        class="pointer-events-none absolute -top-20 -right-20 h-[340px] w-[340px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #C4704D 0%, transparent 70%)",
        }}
      />
      <div
        class="pointer-events-none absolute top-[55%] -left-24 h-[280px] w-[280px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #C4704D 0%, transparent 70%)",
        }}
      />
      <div
        class="pointer-events-none absolute right-8 bottom-[30%] h-[200px] w-[200px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #D4956D 0%, transparent 70%)",
        }}
      />

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Top bar */}
        <header
          class="flex items-center justify-between px-6 pt-12 pb-2"
          style={{ animation: "c-fade-in 0.7s ease-out both" }}
        >
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#C4704D]/10">
              <span
                class="text-[14px] text-[#C4704D]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                h
              </span>
            </div>
            <span class="text-[13px] font-medium tracking-wide opacity-50">
              hit tracker
            </span>
          </div>
          <span class="text-[12px] font-light opacity-35">Friday</span>
        </header>

        {/* Hero */}
        <section class="px-6 pt-14 pb-4">
          <p
            class="mb-3 text-[13px] font-light tracking-wide opacity-45"
            style={{ animation: "c-fade-in-up 0.7s ease-out 0.15s both" }}
          >
            Good morning
          </p>
          <h1
            class="mb-4 text-[44px] leading-[1.1] font-normal tracking-[-0.01em]"
            style={{
              fontFamily: "'Instrument Serif', serif",
              animation: "c-fade-in-up 0.8s ease-out 0.25s both",
            }}
          >
            Ready to
            <br />
            <em class="text-[#C4704D]">train</em> today?
          </h1>
          <p
            class="max-w-[280px] text-[14px] leading-[1.7] font-light opacity-45"
            style={{ animation: "c-fade-in-up 0.7s ease-out 0.4s both" }}
          >
            Your body adapts to challenge.
            <br />
            Give it a reason.
          </p>
        </section>

        {/* Quick stats pills */}
        <section
          class="flex gap-2.5 px-6 pt-6 pb-10"
          style={{ animation: "c-fade-in-up 0.7s ease-out 0.5s both" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              class="rounded-2xl border border-[#2C2420]/[0.06] bg-white/60 px-4 py-2.5"
            >
              <span class="text-[15px] font-medium">{stat.value}</span>
              <span class="ml-1.5 text-[11px] font-light opacity-40">
                {stat.label}
              </span>
            </div>
          ))}
        </section>

        {/* Start workout button */}
        <section
          class="px-6 pb-8"
          style={{ animation: "c-fade-in-up 0.8s ease-out 0.6s both" }}
        >
          <button class="group w-full rounded-2xl bg-[#C4704D] px-6 py-5 text-left shadow-lg shadow-[#C4704D]/15 transition-all duration-400 hover:shadow-xl hover:shadow-[#C4704D]/20 active:scale-[0.98]">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[16px] font-medium text-white">
                  Start freeform workout
                </p>
                <p class="mt-1 text-[13px] font-light text-white/60">
                  Choose exercises as you go
                </p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <span class="text-[18px] text-white">→</span>
              </div>
            </div>
          </button>
        </section>

        {/* Routines section */}
        <section class="px-6 pb-12">
          <div
            class="mb-5 flex items-center justify-between"
            style={{ animation: "c-fade-in 0.7s ease-out 0.7s both" }}
          >
            <h2
              class="text-[13px] tracking-[0.12em] uppercase opacity-35"
              style={{ fontWeight: 500 }}
            >
              Your routines
            </h2>
            <button class="text-[12px] font-medium text-[#C4704D] opacity-70 transition-opacity hover:opacity-100">
              Edit
            </button>
          </div>

          <div class="space-y-3">
            {routines.map((routine, i) => (
              <button
                key={routine.name}
                class="group w-full rounded-2xl border border-[#2C2420]/[0.05] bg-white/70 p-5 text-left shadow-sm transition-all duration-300 hover:border-[#C4704D]/15 hover:shadow-md active:scale-[0.99]"
                style={{
                  animation: `c-fade-in-up 0.7s ease-out ${0.8 + i * 0.1}s both`,
                }}
              >
                <div class="flex items-center gap-4">
                  <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6F1]">
                    <span class="text-[18px] text-[#C4704D]/60">
                      {routine.emoji}
                    </span>
                  </div>
                  <div class="flex-1">
                    <h3
                      class="text-[16px] font-normal"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                      }}
                    >
                      {routine.name}
                    </h3>
                    <p class="mt-0.5 text-[12px] font-light opacity-35">
                      {routine.count} exercises
                    </p>
                  </div>
                  <span class="text-[14px] opacity-20 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-40">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Motivational footer */}
        <section
          class="px-6 pb-8 text-center"
          style={{ animation: "c-fade-in 0.7s ease-out 1.1s both" }}
        >
          <div class="mx-auto max-w-[260px]">
            <div class="mx-auto mb-3 h-px w-12 bg-[#C4704D]/20" />
            <p
              class="text-[15px] leading-[1.6] font-normal opacity-30"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              "Strength does not come from
              <br />
              what you can do."
            </p>
          </div>
        </section>

        {/* Bottom spacer */}
        <div class="h-24" />
      </div>

      {/* Bottom nav — floating pill style */}
      <nav
        class="fixed right-0 bottom-0 left-0 z-40 px-5 pb-6"
        style={{ animation: "c-fade-in-up 0.6s ease-out 0.9s both" }}
      >
        <div class="mx-auto max-w-lg rounded-2xl border border-[#2C2420]/[0.05] bg-white/80 shadow-lg shadow-black/[0.04] backdrop-blur-xl">
          <div class="grid grid-cols-4 py-3">
            {["Workout", "History", "Stats", "Settings"].map((label, i) => (
              <a
                key={label}
                href="#"
                class={`flex flex-col items-center py-1 text-[11px] transition-colors duration-200 ${
                  i === 0
                    ? "font-medium text-[#C4704D]"
                    : "font-normal text-[#2C2420]/30 hover:text-[#2C2420]/50"
                }`}
              >
                {i === 0 && (
                  <div class="mb-1 h-1 w-1 rounded-full bg-[#C4704D]" />
                )}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
