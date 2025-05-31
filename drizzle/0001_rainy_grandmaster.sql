ALTER TABLE "organization" RENAME COLUMN "userId" TO "createdBy";--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;