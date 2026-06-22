import mongoose from 'mongoose';

const codingLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemName: {
      type: String,
      required: [true, 'Problem name is required'],
      trim: true,
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'HackerRank', 'GeeksforGeeks','Others'],
      required: [true, 'Platform is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty is required'],
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CodingLog = mongoose.model('CodingLog', codingLogSchema);

export default CodingLog;
