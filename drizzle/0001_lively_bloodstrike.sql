CREATE TABLE "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"cover" text,
	"year" text NOT NULL,
	"isTrashed" boolean NOT NULL,
	"organizationId" text NOT NULL,
	"createdBy" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedBy" text NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_createdBy_member_userId_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."member"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_updatedBy_member_userId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."member"("userId") ON DELETE no action ON UPDATE no action;