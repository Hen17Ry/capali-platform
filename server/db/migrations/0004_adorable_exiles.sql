ALTER TABLE "mentor_profiles" ADD COLUMN "years_experience" integer;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "current_profession" varchar(255);--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD COLUMN "experiences" jsonb DEFAULT '[]'::jsonb;