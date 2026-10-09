import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['ouvert', 'en cours', 'résolu'],
    default: 'ouvert'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolutionNote: {
    type: String
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.model('Report', reportSchema)