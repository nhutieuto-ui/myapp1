CREATE TYPE "public"."age_band" AS ENUM('under_13', 'thirteen_to_17', 'eighteen_plus');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('tutor', 'learner');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "age_band" "age_band";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tutorRightsConfirmedAt" timestamp;