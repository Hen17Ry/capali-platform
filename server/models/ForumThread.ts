import mongoose from 'mongoose'

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true }, // References PostgreSQL users.id
  authorName: { type: String, required: true },
  category: { type: String, required: true, default: 'Général' },
  tags: [{ type: String }],
  isPinned: { type: Boolean, default: false },
  isClosed: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  reports: [{ reporterId: String, reason: String, reportedAt: { type: Date, default: Date.now } }],
  lastActivityAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const ForumThread = mongoose.models.ForumThread || mongoose.model('ForumThread', forumThreadSchema)
