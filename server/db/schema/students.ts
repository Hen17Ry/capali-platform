import { pgTable, uuid, varchar, jsonb, timestamp, text } from 'drizzle-orm/pg-core'
import { users } from './users'

export const studentProfiles = pgTable('student_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  educationLevel: varchar('education_level', { length: 100 }), // e.g. Licence, Master, Doctorat
  targetedCities: jsonb('targeted_cities').$type<string[]>().default([]), // ['Paris', 'Lyon']
  needsHelp: jsonb('needs_help').$type<string[]>().default([]), // ['logement', 'etudes', 'emploi']
  arrivalDate: varchar('arrival_date', { length: 50 }), // Month/Year or exact date
  presentation: text('presentation'),
  schoolName: varchar('school_name', { length: 255 }), // Name of targeted or current school
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
