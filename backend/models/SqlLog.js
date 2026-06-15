import mongoose from 'mongoose';

const sqlLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress',
    },
    confidenceLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

const SqlLog = mongoose.model('SqlLog', sqlLogSchema);

export default SqlLog;
