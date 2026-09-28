import Link from 'next/link';
import { and, asc, eq, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { quizzes, questions, users } from '@/lib/db/schema';
import { contentLanguageOptions } from '@/lib/validation/quiz';
import { PlayQuiz, type PlayableQuestion } from './play-quiz';

const languageLabels = Object.fromEntries(
  contentLanguageOptions.map((option) => [option.value, option.label])
);

type McqData = { prompt: string; options: { text: string; correct: boolean }[] };
type SentenceData = { sentence: string; segments: string[]; distractors: string[] };
type FlashcardData = { front: string; back: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// US-013 security NFR: correct answers must never be sent to the client before submission
function toPlayableQuestion(question: { id: string; type: string; data: unknown }): PlayableQuestion {
  if (question.type === 'mcq') {
    const data = question.data as McqData;
    return { id: question.id, type: 'mcq', prompt: data.prompt, options: data.options.map((o) => o.text) };
  }
  if (question.type === 'sentence_rearrangement') {
    const data = question.data as SentenceData;
    return {
      id: question.id,
      type: 'sentence_rearrangement',
      pool: shuffle([...data.segments, ...data.distractors]),
    };
  }
  const data = question.data as FlashcardData;
  return { id: question.id, type: 'flashcard', front: data.front, back: data.back };
}

export default async function PlayQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // US-013 AC9: only a published (public or unlisted) quiz can be opened
  const [quiz] = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      contentLanguage: quizzes.contentLanguage,
      status: quizzes.status,
      ownerName: users.name,
    })
    .from(quizzes)
    .innerJoin(users, eq(users.id, quizzes.ownerId))
    .where(and(eq(quizzes.id, id), ne(quizzes.status, 'draft')))
    .limit(1);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-lg font-semibold text-gray-900">Quiz not available</h1>
          <p className="mt-2 text-sm text-gray-500">
            This link is invalid, or the quiz is no longer published (AC9).
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const quizQuestions = await db
    .select({ id: questions.id, type: questions.type, data: questions.data })
    .from(questions)
    .where(eq(questions.quizId, id))
    .orderBy(asc(questions.position));

  const playableQuestions = quizQuestions.map(toPlayableQuestion);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            By {quiz.ownerName ?? 'a tutor'} · {languageLabels[quiz.contentLanguage] ?? quiz.contentLanguage}
          </p>
          {quiz.description && <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <PlayQuiz quizId={quiz.id} questions={playableQuestions} />
      </div>
    </div>
  );
}
