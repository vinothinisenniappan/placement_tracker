import CodingLog from '../models/CodingLog.js';

export const getCodingLogs = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty;
  }

  const logs = await CodingLog.find(filter).sort({ solvedAt: -1 });
  res.json(logs);
};

export const createCodingLog = async (req, res) => {
  const { problemName, platform, difficulty, solvedAt } = req.body;

  if (!problemName || !platform || !difficulty) {
    return res.status(400).json({ message: 'Problem name, platform, and difficulty are required' });
  }

  const log = await CodingLog.create({
    user: req.user._id,
    problemName,
    platform,
    difficulty,
    solvedAt,
  });

  res.status(201).json(log);
};

export const updateCodingLog = async (req, res) => {
  const log = await CodingLog.findOne({ _id: req.params.id, user: req.user._id });

  if (!log) {
    return res.status(404).json({ message: 'Coding log not found' });
  }

  const { problemName, platform, difficulty, solvedAt } = req.body;

  if (problemName) log.problemName = problemName;
  if (platform) log.platform = platform;
  if (difficulty) log.difficulty = difficulty;
  if (solvedAt) log.solvedAt = solvedAt;

  await log.save();
  res.json(log);
};

export const deleteCodingLog = async (req, res) => {
  const log = await CodingLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!log) {
    return res.status(404).json({ message: 'Coding log not found' });
  }

  res.json({ message: 'Coding log removed' });
};
