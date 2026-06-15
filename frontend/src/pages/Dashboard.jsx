import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MetricCard from '../components/MetricCard';
import ProgressScore from '../components/ProgressScore';
import QuickActionModal from '../components/QuickActionModal';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-sm text-slate-500">
              Your central hub for placement preparation progress.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
          >
            + Quick Log
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner label="Loading dashboard..." />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && stats && (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Coding Solved"
                value={stats.metrics.totalCodingSolved}
                subtitle="Total problems logged"
                accent="primary"
              />
              <MetricCard
                title="SQL Practiced"
                value={stats.metrics.totalSqlPracticed}
                subtitle="Topics tracked"
                accent="secondary"
              />
              <MetricCard
                title="Applications"
                value={stats.metrics.totalApplications}
                subtitle="Companies applied to"
                accent="emerald"
              />
              <MetricCard
                title="Current Streak"
                value={`${stats.metrics.currentStreak} days`}
                subtitle="Consecutive active days"
                accent="amber"
              />
            </section>

            <ProgressScore
              readinessScore={stats.progress.readinessScore}
              codingProgress={stats.progress.codingProgress}
              sqlProgress={stats.progress.sqlProgress}
              appProgress={stats.progress.appProgress}
              goals={stats.progress.goals}
            />
          </div>
        )}
      </main>

      <QuickActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
};

export default Dashboard;
