import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { quizzes, questions } from '@/lib/db/schema';
import { contentLanguageOptions, MAX_QUIZZES_PER_AUTHOR } from '@/lib/validation/quiz';
import { MAX_QUESTIONS_PER_QUIZ } from '@/lib/validation/question';
import { AddQuestionDialog } from './add-question-dialog';
import { DeleteQuestionButton } from './delete-question-button';
import { MoveQuestionButtons } from './move-question-buttons';
import { PublishDialog } from './publish-dialog';

const languageLabels = Object.fromEntries(
  contentLanguageOptions.map((option) => [option.value, option.label])
);

const statusStyles: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  unlisted: 'bg-blue-100 text-blue-700',
  public: 'bg-green-100 text-green-700',
};

const typeLabels: Record<string, string> = {
  mcq: 'MCQ',
  sentence_rearrangement: 'Rearrange',
  flashcard: 'Flashcard',
};

type McqData = { prompt: string; options: { text: string; correct: boolean }[] };
type SentenceData = { sentence: string; segments: string[]; distractors: string[] };
type FlashcardData = { front: string; back: string };

function questionSummary(type: string, data: unknown): string {
  if (type === 'mcq') {
    return (data as McqData).prompt;
  }
  if (type === 'sentence_rearrangement') {
    return `Put the words in order: "${(data as SentenceData).sentence}"`;
  }
  if (type === 'flashcard') {
    return (data as FlashcardData).front;
  }
  return '';
}

export default async function QuizEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role !== 'tutor') {
    redirect('/');
  }

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.ownerId, session.user.id)))
    .limit(1);
  if (!quiz) {
    notFound();
  }

  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, id))
    .orderBy(asc(questions.position));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link href="/quizzes" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Quizzes
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[quiz.status]}`}
            >
              {quiz.status}
            </span>
          </div>
        </div>
        <PublishDialog quizId={quiz.id} status={quiz.status} />
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Content language</p>
            <p className="text-sm text-gray-600 mt-1">
              {languageLabels[quiz.contentLanguage] ?? quiz.contentLanguage}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Questions</p>
            <p className="text-sm text-gray-600 mt-1">
              {quiz.questionCount} of {MAX_QUESTIONS_PER_QUIZ} used (DEC-16)
            </p>
          </div>
          {quiz.description && (
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Questions ({quizQuestions.length})</h2>
            <AddQuestionDialog quizId={quiz.id} contentLanguage={quiz.contentLanguage} />
          </div>

          {quizQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <p className="text-gray-900 font-medium">No questions yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Click &quot;+ Add question&quot; to add your first Multiple Choice, Sentence
                Rearrangement, or Flashcard question.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {quizQuestions.map((question, index) => (
                <li
                  key={question.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4"
                >
                  <MoveQuestionButtons
                    quizId={quiz.id}
                    questionId={question.id}
                    disableUp={index === 0}
                    disableDown={index === quizQuestions.length - 1}
                  />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 shrink-0">
                    {typeLabels[question.type] ?? question.type}
                  </span>
                  <p className="flex-1 text-sm text-gray-900">
                    {index + 1}. {questionSummary(question.type, question.data)}
                  </p>
                  <DeleteQuestionButton quizId={quiz.id} questionId={question.id} />
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Adding a {MAX_QUESTIONS_PER_QUIZ + 1}th question is blocked with a message per AC8.
            Your quota is {MAX_QUIZZES_PER_AUTHOR} quizzes in total (DEC-26).
          </p>
        </div>
      </div>
    </div>
  );
}
