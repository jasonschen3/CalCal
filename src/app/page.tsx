import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ee] via-[#fef9f3] to-[#f5ede4]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="CalCal" width={36} height={36} />
          <span className="text-xl font-extrabold text-[var(--foreground)]">CalCal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
            Sign in
          </Link>
          <Link
            href="/auth/signin"
            className="bg-[var(--primary)] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[var(--primary-hover)] transition-colors shadow-cozy"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--primary-light)] border-2 border-[var(--border-strong)] text-[var(--primary-text)] text-sm font-bold px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
          Calendar-aware nutrition copilot
        </div>

        <h1 className="text-5xl font-extrabold text-[var(--foreground)] leading-tight mb-6 max-w-3xl mx-auto">
          Eat well around{" "}
          <span className="text-[var(--primary)]">your actual schedule</span>
        </h1>

        <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          CalCal syncs with your calendar, finds smart meal windows, and tells you the best thing
          to eat next — whether that&apos;s ordering nearby or using what you have at home.
        </p>

        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-3 bg-[var(--surface-raised)] border-2 border-[var(--border)] text-[var(--foreground)] font-bold px-6 py-3.5 rounded-2xl hover:border-[var(--border-strong)] hover:shadow-cozy-md transition-all text-base shadow-cozy"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Link>

        <p className="text-sm text-[var(--text-faint)] mt-4 font-medium">No credit card required</p>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: "calendar" as const,
              title: "Calendar-aware",
              desc: "Syncs with your Google Calendar and finds real gaps for meals between your commitments.",
            },
            {
              icon: "map-pin" as const,
              title: "Location-smart",
              desc: "Finds the best nearby restaurants based on your goals, restrictions, and time available.",
            },
            {
              icon: "sparkles" as const,
              title: "Context-first AI",
              desc: "Recommends what to cook from your fridge or what to order — with a simple letter grade.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] p-6 shadow-cozy">
              <div className="w-12 h-12 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center mb-4 text-[var(--primary-text)]">
                <Icon name={f.icon} size={22} />
              </div>
              <h3 className="font-extrabold text-[var(--foreground)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="bg-[var(--surface)] rounded-3xl border-2 border-[var(--border)] shadow-cozy-md overflow-hidden">
          <div className="bg-[var(--background)] border-b-2 border-[var(--border)] px-6 py-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-3 text-xs text-[var(--text-faint)] font-bold">CalCal — Dashboard</span>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[var(--text-muted)] font-medium">Today&apos;s grade</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-extrabold" style={{ color: "var(--grade-a)" }}>A</span>
                  <span className="text-sm text-[var(--text-faint)] font-medium">3 meal windows identified</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--text-muted)] font-medium">Goal</p>
                <p className="font-extrabold text-[var(--foreground)]">High Protein</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Breakfast", time: "8:00–8:45 AM", path: "Eat at Home", grade: "A", urgencyClass: "bg-[var(--urgency-now-bg)] text-[var(--urgency-now-text)]", urgencyLabel: "Now" },
                { label: "Lunch Window", time: "12:15–1:00 PM", path: "Eat Out", grade: "A+", urgencyClass: "bg-[var(--urgency-soon-bg)] text-[var(--urgency-soon-text)]", urgencyLabel: "In 2h" },
                { label: "Dinner", time: "6:30–7:30 PM", path: "Flexible", grade: "A", urgencyClass: "bg-[var(--urgency-later-bg)] text-[var(--urgency-later-text)]", urgencyLabel: "Later" },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between bg-[var(--background)] rounded-2xl px-5 py-4 border-2 border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border border-current/20 ${m.urgencyClass}`}>{m.urgencyLabel}</span>
                    <div>
                      <p className="font-bold text-[var(--foreground)] text-sm">{m.label}</p>
                      <p className="text-xs text-[var(--text-faint)] font-medium">{m.time} · {m.path}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 ${m.grade === "A+" ? "grade-aplus" : "grade-a"}`}>{m.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[var(--border)] py-8 text-center text-sm text-[var(--text-faint)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/logo.svg" alt="CalCal" width={20} height={20} />
          <span className="font-extrabold text-[var(--text-muted)]">CalCal</span>
        </div>
        <p className="font-medium">Eat well around your actual life.</p>
      </footer>
    </div>
  );
}
