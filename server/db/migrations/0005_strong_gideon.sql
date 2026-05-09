CREATE TABLE "student_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"education_level" varchar(100),
	"targeted_cities" jsonb DEFAULT '[]'::jsonb,
	"needs_help" jsonb DEFAULT '[]'::jsonb,
	"arrival_date" varchar(50),
	"presentation" varchar(500),
	"school_name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;