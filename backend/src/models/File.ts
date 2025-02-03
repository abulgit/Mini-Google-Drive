// File.ts
import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: [true, 'Filename is required'],
    trim: true
  },
  actualFilename: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  fileId: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true, min: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', FileSchema);