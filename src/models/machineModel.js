import mongoose from 'mongoose'

const machineSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  workshop: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['disponible', 'en maintenance', 'hors service'],
    default: 'disponible'
  }
}, {
  timestamps: true
})

export default mongoose.model('Machine', machineSchema)