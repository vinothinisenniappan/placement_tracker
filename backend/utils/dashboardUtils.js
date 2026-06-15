const CODING_GOAL = 100;
const SQL_GOAL = 50;
const APP_GOAL = 20;

export const GOALS = {
  coding: CODING_GOAL,
  sql: SQL_GOAL,
  applications: APP_GOAL,
};

export const calculateProgressPercent = (count, goal) =>
  Math.min(100, Math.round((count / goal) * 100));

export const calculateReadinessScore = (codingPct, sqlPct, appPct) =>
  Math.round(codingPct * 0.4 + sqlPct * 0.3 + appPct * 0.3);

export const calculateStreak = (activityDates) => {
  if (!activityDates.length) {
    return 0;
  }

  const uniqueDays = [
    ...new Set(
      activityDates.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latest = uniqueDays[0];
  if (latest !== today.getTime() && latest !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  let cursor = latest;

  for (let i = 1; i < uniqueDays.length; i += 1) {
    const expected = cursor - 24 * 60 * 60 * 1000;
    if (uniqueDays[i] === expected) {
      streak += 1;
      cursor = uniqueDays[i];
    } else {
      break;
    }
  }

  return streak;
};
