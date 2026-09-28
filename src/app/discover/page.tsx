import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPublishedQuizzes } from "@/lib/catalog";
import { contentLanguageOptions } from "@/lib/validation/quiz";

const languageLabels = Object.fromEntries(
  contentLanguageOptions.map((option) => [option.value, option.label])
);

// US-020 AC5 link target. Minimal listing only — search/filter is US-011's own remaining scope.
export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const catalogQuizzes = await getPublishedQuizzes(50);

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
        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand-700">
          Home
        </Link>
      </header>

      <main className="p-6 space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Discover quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Published quizzes, most played first (DEC-38)
          </p>
        </div>

        {catalogQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <p className="text-gray-900 font-medium">No published quizzes yet</p>
            <p className="text-sm text-gray-500 mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/play/${quiz.id}`}
                className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-brand-300"
              >
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 mb-2">
                  {languageLabels[quiz.contentLanguage] ?? quiz.contentLanguage}
                </span>
                <h2 className="font-medium text-gray-900">{quiz.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {quiz.questionCount} questions · by {quiz.ownerName ?? "Unknown"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
