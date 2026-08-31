import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { quizzes } from '@/lib/db/schema';
import { contentLanguageOptions, MAX_QUIZZES_PER_AUTHOR } from '@/lib/validation/quiz';
import { CreateQuizDialog } from './create-quiz-dialog';
import { DeleteQuizButton } from './delete-quiz-button';

const languageLabels = Object.fromEntries(
  contentLanguageOptions.map((option) => [option.value, option.label])
);

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  unlisted: 'bg-blue-100 text-blue-700',
  public: 'bg-green-100 text-green-700',
};

function formatLastEdited(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default async function QuizzesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role !== 'tutor') {
    redirect('/');
  }

  const myQuizzes = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.ownerId, session.user.id))
    .orderBy(desc(quizzes.updatedAt));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage the quizzes you author</p>
        </div>
        <CreateQuizDialog />
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <p className="text-sm text-gray-500">
          {myQuizzes.length} of {MAX_QUIZZES_PER_AUTHOR} quizzes used (per-author quota, DEC-26)
        </p>

        {myQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <p className="text-gray-900 font-medium">You haven&apos;t created a quiz yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Click &quot;+ New quiz&quot; to create your first draft (AC1).
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last edited
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{quiz.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {languageLabels[quiz.contentLanguage] ?? quiz.contentLanguage}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quiz.questionCount} / 30</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[quiz.status]}`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatLastEdited(quiz.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </Link>
                      <DeleteQuizButton quizId={quiz.id} title={quiz.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Drafts (AC5) are private and only visible to their owner (AC6). Click &quot;Edit&quot;
          to add questions and publish (US-004/005/006, US-009).
        </p>
      </div>
    </div>
  );
}
