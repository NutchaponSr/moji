CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"inviteCode" text NOT NULL,
	"organizationId" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "inviteCode";