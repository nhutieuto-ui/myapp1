CREATE TYPE "public"."quiz_content_language" AS ENUM('chinese', 'japanese', 'english');--> statement-breakpoint
CREATE TYPE "public"."quiz_status" AS ENUM('draft', 'unlisted', 'public');--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content_language" "quiz_content_language" NOT NULL,
	"status" "quiz_status" DEFAULT 'draft' NOT NULL,
	"question_count" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;