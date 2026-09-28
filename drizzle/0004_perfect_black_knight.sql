CREATE TABLE "attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"quizId" text NOT NULL,
	"participantName" text NOT NULL,
	"score" integer NOT NULL,
	"scoredQuestionCount" integer NOT NULL,
	"submittedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"answer" jsonb,
	"correct" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_attemptId_attempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_questionId_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;