import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const resourceTypeEnum = pgEnum('resource_type', ['article', 'video', 'webinar'])
export const resourceThemeEnum = pgEnum('resource_theme', [
  'logement', 'banque', 'etudes', 'emploi', 'vie_quotidienne',
  'sante', 'orientation', 'droits',
])
export const resourceLevelEnum = pgEnum('resource_level', [
  'predeparture', 'first_month', 'installed',
])
export const resourceCountryEnum = pgEnum('resource_country', ['benin', 'france', 'both'])

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: varchar('excerpt', { length: 500 }),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  type: resourceTypeEnum('type').notNull().default('article'),
  theme: resourceThemeEnum('theme').notNull(),
  targetCountry: resourceCountryEnum('target_country').notNull().default('both'),
  targetLevel: resourceLevelEnum('target_level').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  isDraft: boolean('is_draft').notNull().default(true),
  videoId: text('video_id'),
  // Social import tracking
  sourceUrl: text('source_url'),
  sourcePlatform: varchar('source_platform', { length: 50 }),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})