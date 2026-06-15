import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const TABS = [
  { id: 'coding', label: 'Coding Log' },
  { id: 'sql', label: 'SQL & Aptitude' },
  { id: 'jobs', label: 'Job Pipeline' },
];

const STATUS_STYLES = {
  Applied: 'bg-slate-100 text-slate-700',
  OA: 'bg-amber-50 text-amber-700',
  Interview: 'bg-primary/10 text-primary',
  Rejected: 'bg-red-50 text-red-600',
  Selected: 'bg-emerald-50 text-emerald-700',
  Easy: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard: 'bg-red-50 text-red-600',
  'In Progress': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Low: 'bg-red-50 text-red-600',
  High: 'bg-emerald-50 text-emerald-700',
};

const TrackerView = () => {
  const [activeTab, setActiveTab] = useState('coding');
  const [codingLogs, setCodingLogs] = useState([]);
  const [sqlLogs, setSqlLogs] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const codingParams = difficultyFilter ? { difficulty: difficultyFilter } : {};
      const [codingRes, sqlRes, jobsRes] = await Promise.all([
        api.get('/coding', { params: codingParams }),
        api.get('/sql'),
        api.get('/jobs'),
      ]);

      setCodingLogs(codingRes.data);
      setSqlLogs(sqlRes.data);
      setJobApplications(jobsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tracker data');
    } finally {
      setLoading(false);
    }
  }, [difficultyFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (type, id) => {
    try {
      if (type === 'coding') await api.delete(`/coding/${id}`);
      if (type === 'sql') await api.delete(`/sql/${id}`);
      if (type === 'jobs') await api.delete(`/jobs/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete entry');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Unified Tracker</h2>
          <p className="text-sm text-slate-500">
            View and manage all your preparation logs in one place.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-card">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner label="Loading tracker data..." />
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && activeTab === 'coding' && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Coding Log</h3>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <DataTable
              headers={['Problem', 'Platform', 'Difficulty', 'Date', '']}
              rows={codingLogs.map((log) => [
                log.problemName,
                log.platform,
                <Badge key={`${log._id}-diff`} label={log.difficulty} />,
                formatDate(log.solvedAt),
                <DeleteButton key={`${log._id}-del`} onClick={() => handleDelete('coding', log._id)} />,
              ])}
              emptyMessage="No coding problems logged yet. Use Quick Log on the dashboard."
            />
          </section>
        )}

        {!loading && activeTab === 'sql' && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">SQL & Aptitude Log</h3>
            <DataTable
              headers={['Topic', 'Status', 'Confidence', 'Updated', '']}
              rows={sqlLogs.map((log) => [
                log.topicName,
                <Badge key={`${log._id}-status`} label={log.status} />,
                <Badge key={`${log._id}-conf`} label={log.confidenceLevel} />,
                formatDate(log.updatedAt),
                <DeleteButton key={`${log._id}-del`} onClick={() => handleDelete('sql', log._id)} />,
              ])}
              emptyMessage="No SQL topics logged yet."
            />
          </section>
        )}

        {!loading && activeTab === 'jobs' && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Job Application Pipeline</h3>

            {jobApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No job applications logged yet.</p>
            ) : (
              <div className="space-y-4">
                {jobApplications.map((job, index) => (
                  <div key={job._id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      {index < jobApplications.length - 1 && (
                        <div className="mt-1 h-full w-px flex-1 bg-slate-200" />
                      )}
                    </div>
                    <div className="mb-2 flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{job.company}</p>
                          <p className="text-sm text-slate-600">{job.role}</p>
                          <p className="mt-1 text-xs text-slate-400">Applied: {formatDate(job.appliedAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge label={job.status} />
                          <DeleteButton onClick={() => handleDelete('jobs', job._id)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const DataTable = ({ headers, rows, emptyMessage }) => {
  if (!rows.length) {
    return <p className="py-8 text-center text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            {headers.map((header) => (
              <th key={header} className="px-3 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-50 hover:bg-slate-50/80">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Badge = ({ label }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      STATUS_STYLES[label] || 'bg-slate-100 text-slate-700'
    }`}
  >
    {label}
  </span>
);

const DeleteButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
  >
    Delete
  </button>
);

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default TrackerView;
