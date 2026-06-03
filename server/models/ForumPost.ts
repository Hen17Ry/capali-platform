import mongoose from 'mongoose'

const forumPostSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true }, // References PostgreSQL users.id
  authorName: { type: String, required: true },
  reports: [{ reporterId: String, reason: String, reportedAt: { type: Date, default: Date.now } }],
  upvotes: [{ type: String }], // Array of userIds who upvoted
}, { timestamps: true })

export const ForumPost = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema)
