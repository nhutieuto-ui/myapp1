import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { getPublishedQuizzes } from "@/lib/catalog";
import { contentLanguageOptions } from "@/lib/validation/quiz";

const languageLabels = Object.fromEntries(
  contentLanguageOptions.map((option) => [option.value, option.label])
);

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

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name ?? session.user.email ?? "there";
  const firstName = displayName.split(" ")[0];

  // US-020 AC2/AC3: real published-quiz preview, not a recommendation engine (AS-020.1)
  const recommendedQuizzes = await getPublishedQuizzes(3);

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
          <Link
            href="/discover"
            className="text-sm font-medium text-gray-600 hover:text-brand-700"
          >
            Discover
          </Link>
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
          <p className="text-sm text-gray-500 mt-1">Ready to practice something new?</p>
        </div>

        {/* US-020 AC6: no "Continue learning" card — attempts aren't linked to a learner
            account yet, so there is no real in-progress state to resume (Q-020.1). */}

        {/* Recommended */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recommended for you</h2>
            <Link href="/discover" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              See all
            </Link>
          </div>
          {recommendedQuizzes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <p className="text-gray-900 font-medium">No published quizzes yet</p>
              <p className="text-sm text-gray-500 mt-1">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedQuizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/play/${quiz.id}`}
                  className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-brand-300"
                >
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 mb-2">
                    {languageLabels[quiz.contentLanguage] ?? quiz.contentLanguage}
                  </span>
                  <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {quiz.questionCount} questions · by {quiz.ownerName ?? "Unknown"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

