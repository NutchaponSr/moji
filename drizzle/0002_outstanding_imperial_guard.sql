CREATE TYPE "public"."plan" AS ENUM('free', 'plus');--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "plan" "plan" DEFAULT 'free' NOT NULL;