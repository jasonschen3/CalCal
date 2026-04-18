import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#eff6ff]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-base font-bold">CC</span>
          </div>
          <span className="text-xl font-bold text-gray-900">CalCal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/auth/signin"
            className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Calendar-aware nutrition copilot
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
          Eat well around{" "}
          <span className="text-green-600">your actual schedule</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          CalCal syncs with your calendar, finds smart meal windows, and tells you the best thing
          to eat next — whether that&apos;s ordering nearby or using what you have at home.
        </p>

        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium px-6 py-3.5 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-base shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Link>

        <p className="text-sm text-gray-400 mt-4">No credit card required</p>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: "📅",
              title: "Calendar-aware",
              desc: "Syncs with your Google Calendar and finds real gaps for meals between your commitments.",
            },
            {
              icon: "📍",
              title: "Location-smart",
              desc: "Finds the best nearby restaurants based on your goals, restrictions, and time available.",
            },
            {
              icon: "🧠",
              title: "Context-first AI",
              desc: "Recommends what to cook from your fridge or what to order — with a simple letter grade.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-3 text-xs text-gray-400 font-medium">CalCal — Dashboard</span>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s grade</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-bold text-green-600">A</span>
                  <span className="text-sm text-gray-400">3 meal windows identified</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="font-semibold text-gray-900">High Protein</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Breakfast", time: "8:00–8:45 AM", path: "Eat at Home", grade: "A", urgency: "bg-orange-100 text-orange-700", urgencyLabel: "Now" },
                { label: "Lunch Window", time: "12:15–1:00 PM", path: "Eat Out", grade: "A+", urgency: "bg-blue-100 text-blue-700", urgencyLabel: "In 2h" },
                { label: "Dinner", time: "6:30–7:30 PM", path: "Flexible", grade: "A", urgency: "bg-gray-100 text-gray-600", urgencyLabel: "Later" },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.urgency}`}>{m.urgencyLabel}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.time} · {m.path}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    m.grade === "A+" || m.grade === "A" ? "grade-a" : "grade-b"
                  }`}>{m.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <span className="font-medium text-gray-600">CalCal</span>
        </div>
        <p>Eat well around your actual life.</p>
      </footer>
    </div>
  );
}
