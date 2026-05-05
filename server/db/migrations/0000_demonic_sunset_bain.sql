CREATE TYPE "public"."user_status" AS ENUM('predeparture', 'newcomer', 'installed', 'mentor');--> statement-breakpoint
CREATE TYPE "public"."mentorship_status" AS ENUM('pending', 'accepted', 'refused', 'cancelled', 'closed');--> statement-breakpoint
CREATE TYPE "public"."resource_country" AS ENUM('benin', 'france', 'both');--> statement-breakpoint
CREATE TYPE "public"."resource_level" AS ENUM('predeparture', 'first_month', 'installed');--> statement-breakpoint
CREATE TYPE "public"."resource_theme" AS ENUM('logement', 'banque', 'etudes', 'emploi', 'vie_quotidienne', 'sante', 'orientation', 'droits');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('article', 'video', 'webinar');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('france', 'benin', 'online');--> statement-breakpoint
CREATE TYPE "public"."notif_type" AS ENUM('mentorship_request', 'mentorship_accepted', 'mentorship_refused', 'forum_reply', 'new_event', 'admin_message');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"name" varchar(100) NOT NULL,
	"avatar_url" varchar(500),
	"country_origin" varchar(100),
	"city_current_fr" varchar(100),
	"status" "user_status" DEFAULT 'predeparture' NOT NULL,
	"domain" varchar(100),
	"bio" varchar(280),
	"is_admin" boolean DEFAULT false NOT NULL,
	"email_verified_at" timestamp,
	"notif_email" boolean DEFAULT true NOT NULL,
	"notif_summary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mentor_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"city_in_france" varchar(100),
	"available_hours_month" integer,
	"max_mentees" integer DEFAULT 2 NOT NULL,
	"accepts_remote" boolean DEFAULT true NOT NULL,
	"accepts_inperson" boolean DEFAULT false NOT NULL,
	"presentation" text,
	"is_validated" boolean DEFAULT false NOT NULL,
	"is_paused" boolean DEFAULT false NOT NULL,
	"validated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentorship_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentee_id" uuid NOT NULL,
	"mentor_id" uuid NOT NULL,
	"status" "mentorship_status" DEFAULT 'pending' NOT NULL,
	"message" text NOT NULL,
	"mentor_note" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" "resource_type" DEFAULT 'article' NOT NULL,
	"theme" "resource_theme" NOT NULL,
	"target_country" "resource_country" DEFAULT 'both' NOT NULL,
	"target_level" "resource_level" NOT NULL,
	"author_id" uuid,
	"is_draft" boolean DEFAULT true NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"flagged_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"theme" "resource_theme" NOT NULL,
	"author_id" uuid NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "event_type" NOT NULL,
	"city" varchar(100),
	"event_date" timestamp NOT NULL,
	"registration_url" varchar(500),
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notif_type" NOT NULL,
	"payload" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentee_id_users_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;