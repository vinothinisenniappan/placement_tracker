import CodingLog from '../models/CodingLog.js';
import SqlLog from '../models/SqlLog.js';
import JobApplication from '../models/JobApplication.js';
import {
  GOALS,
  calculateProgressPercent,
  calculateReadinessScore,
  calculateStreak,
} from '../utils/dashboardUtils.js';

export const getDashboardStats = async (req, res) => {
  const userId = req.user._id;

  const [codingCount, sqlCount, sqlCompletedCount, applicationCount, codingDates, sqlDates, jobDates] =
    await Promise.all([
      CodingLog.countDocuments({ user: userId }),
      SqlLog.countDocuments({ user: userId }),
      SqlLog.countDocuments({ user: userId, status: 'Completed' }),
      JobApplication.countDocuments({ user: userId }),
      CodingLog.find({ user: userId }).select('solvedAt createdAt'),
      SqlLog.find({ user: userId }).select('createdAt updatedAt'),
      JobApplication.find({ user: userId }).select('appliedAt createdAt'),
    ]);

  const codingProgress = calculateProgressPercent(codingCount, GOALS.coding);
  const sqlProgress = calculateProgressPercent(sqlCompletedCount, GOALS.sql);
  const appProgress = calculateProgressPercent(applicationCount, GOALS.applications);

  const readinessScore = calculateReadinessScore(codingProgress, sqlProgress, appProgress);

  const activityDates = [
    ...codingDates.map((log) => log.solvedAt || log.createdAt),
    ...sqlDates.map((log) => log.updatedAt || log.createdAt),
    ...jobDates.map((log) => log.appliedAt || log.createdAt),
  ];

  const currentStreak = calculateStreak(activityDates);

  res.json({
    metrics: {
      totalCodingSolved: codingCount,
      totalSqlPracticed: sqlCount,
      totalApplications: applicationCount,
      currentStreak,
    },
    progress: {
      codingProgress,
      sqlProgress,
      appProgress,
      readinessScore,
      goals: GOALS,
    },
  });
};
