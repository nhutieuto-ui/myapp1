ALTER TABLE "quiz" ADD COLUMN "join_code" text;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_join_code_unique" UNIQUE("join_code");