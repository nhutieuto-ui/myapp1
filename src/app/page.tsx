import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

function getInitials(label: string) {
  const parts = label.trim().split(/\s+/);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : label.slice(0, 2);
  return initials.toUpperCase();
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Illustrative placeholder data — not backed by a user story yet (see wireframe note below).
// Wired up to real data once Discover/Play/Leaderboard stories are implemented.
const recommendedQuizzes = [
  { type: "Multiple Choice", title: "JLPT N4 Vocabulary Sprint", meta: "Japanese · 12 questions" },
  { type: "Sentence Rearrangement", title: "HSK 3 Sentence Builder", meta: "Chinese · 8 questions" },
  { type: "Flashcard", title: "English Idioms, Set 2", meta: "English · 15 cards" },
];

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name ?? session.user.email ?? "there";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-semibold text-sm"
            aria-hidden="true"
          >
            LQ
          </div>
          <span className="font-semibold text-gray-900">LinguaQuiz</span>
        </div>
        <div className="flex items-center gap-3">
          {session.user.role === "tutor" && (
            <Link
              href="/quizzes"
              className="text-sm font-medium text-gray-600 hover:text-brand-700"
            >
              My quizzes
            </Link>
          )}
          <div
            className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0"
            aria-hidden="true"
          >
            {getInitials(displayName)}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-900 truncate max-w-[180px]">{displayName}</p>
            <p className="text-gray-500 capitalize">{session.user.role ?? "No role yet"}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ready to keep your streak going?</p>
        </div>

        {/* Continue learning card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center"
              aria-hidden="true"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                Continue learning
              </p>
              <h2 className="font-semibold text-gray-900">A Basic Music Quiz</h2>
              <p className="text-sm text-gray-500">6 of 10 questions completed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:w-64">
            <div
              className="w-full bg-gray-100 rounded-full h-2"
              role="progressbar"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <div className="bg-brand-600 h-2 rounded-full" style={{ width: "60%" }} />
            </div>
            <button
              type="button"
              className="shrink-0 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Resume
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Current streak</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">12 days</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Total points</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">2,569 QP</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Quizzes completed</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">34</p>
          </div>
        </div>

        {/* Recommended */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recommended for you</h2>
            <button type="button" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              See all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedQuizzes.map((quiz) => (
              <article
                key={quiz.title}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
              >
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 mb-2">
                  {quiz.type}
                </span>
                <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{quiz.meta}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Note:</strong> This Home dashboard (streak, points, recommendations) is
          illustrative only, matching the LinguaQuiz wireframe. It will be wired up to real data
          as Discover, Play, and Leaderboard stories are implemented.
        </div>
      </main>
    </div>
  );
}

