import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  mentorshipId: { type: String, required: true }, // References PostgreSQL mentorship_requests.id
  senderId: { type: String, required: true }, // References PostgreSQL users.id
  content: { type: String },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  mediaUrl: { type: String },
  isRead: { type: Boolean, default: false },
}, { timestamps: true })

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
