ALTER TABLE "resources" ADD COLUMN "excerpt" varchar(500);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "source_platform" varchar(50);