CREATE TYPE "public"."question_type" AS ENUM('mcq', 'sentence_rearrangement', 'flashcard');--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"quizId" text NOT NULL,
	"type" "question_type" NOT NULL,
	"position" integer NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz" ADD COLUMN "rightsConfirmedAt" timestamp;--> statement-breakpoint
ALTER TABLE "quiz" ADD COLUMN "publishedAt" timestamp;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;