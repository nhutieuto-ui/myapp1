import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { attempts, quizzes, users } from '@/lib/db/schema';

export type CatalogQuiz = {
  id: string;
  title: string;
  contentLanguage: string;
  questionCount: number;
  ownerName: string | null;
};

// US-011 AC1/DEC-38 + US-020 AC2: published-only, ordered most played then newest (not personalized, AS-020.1)
export async function getPublishedQuizzes(limit: number): Promise<CatalogQuiz[]> {
  const playCount = sql<number>`count(${attempts.id})`;

  return db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      contentLanguage: quizzes.contentLanguage,
      questionCount: quizzes.questionCount,
      ownerName: users.name,
    })
    .from(quizzes)
    .innerJoin(users, eq(users.id, quizzes.ownerId))
    .leftJoin(attempts, eq(attempts.quizId, quizzes.id))
    .where(eq(quizzes.status, 'public'))
    .groupBy(quizzes.id, users.name)
    .orderBy(desc(playCount), desc(quizzes.createdAt))
    .limit(limit);
}
