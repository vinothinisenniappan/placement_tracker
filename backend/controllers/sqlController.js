import SqlLog from '../models/SqlLog.js';

export const getSqlLogs = async (req, res) => {
  const logs = await SqlLog.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(logs);
};

export const createSqlLog = async (req, res) => {
  const { topicName, status, confidenceLevel } = req.body;

  if (!topicName) {
    return res.status(400).json({ message: 'Topic name is required' });
  }

  const log = await SqlLog.create({
    user: req.user._id,
    topicName,
    status,
    confidenceLevel,
  });

  res.status(201).json(log);
};

export const updateSqlLog = async (req, res) => {
  const log = await SqlLog.findOne({ _id: req.params.id, user: req.user._id });

  if (!log) {
    return res.status(404).json({ message: 'SQL log not found' });
  }

  const { topicName, status, confidenceLevel } = req.body;

  if (topicName) log.topicName = topicName;
  if (status) log.status = status;
  if (confidenceLevel) log.confidenceLevel = confidenceLevel;

  await log.save();
  res.json(log);
};

export const deleteSqlLog = async (req, res) => {
  const log = await SqlLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!log) {
    return res.status(404).json({ message: 'SQL log not found' });
  }

  res.json({ message: 'SQL log removed' });
};
