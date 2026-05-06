ALTER TABLE "mentor_profiles" ADD COLUMN "help_topics" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "motivation" text;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "years_in_france" integer;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "languages" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "linkedin_url" varchar(500);