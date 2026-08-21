CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'free', 'failed');--> statement-breakpoint
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_attendees" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "payment_status" "payment_status" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "payment_provider" varchar(50);--> statement-breakpoint
ALTER TABLE "event_attendees" ADD COLUMN "transaction_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "price_eur" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_limited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "max_attendees" integer;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;