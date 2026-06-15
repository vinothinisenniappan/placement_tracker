import { useState } from 'react';
import api from '../services/api';

const initialForms = {
  coding: {
    problemName: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    solvedAt: new Date().toISOString().split('T')[0],
  },
  sql: {
    topicName: '',
    status: 'In Progress',
    confidenceLevel: 'Medium',
  },
  job: {
    company: '',
    role: '',
    status: 'Applied',
    appliedAt: new Date().toISOString().split('T')[0],
  },
};

const QuickActionModal = ({ isOpen, onClose, onSuccess }) => {
  const [logType, setLogType] = useState('coding');
  const [form, setForm] = useState(initialForms.coding);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setLogType(type);
    setForm(initialForms[type]);
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (logType === 'coding') {
        await api.post('/coding', form);
      } else if (logType === 'sql') {
        await api.post('/sql', form);
      } else {
        await api.post('/jobs', form);
      }

      onSuccess?.();
      onClose();
      setForm(initialForms[logType]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-card-hover">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Quick Log Entry</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <label className="mb-4 block text-sm font-medium text-slate-700">
          Entry Type
          <select
            value={logType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="coding">Coding Problem</option>
            <option value="sql">SQL Topic</option>
            <option value="job">Job Application</option>
          </select>
        </label>

        <form onSubmit={handleSubmit} className="space-y-4">
          {logType === 'coding' && (
            <>
              <Input label="Problem Name" name="problemName" value={form.problemName} onChange={handleChange} required />
              <Select
                label="Platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                options={['LeetCode', 'HackerRank', 'GeeksforGeeks']}
              />
              <Select
                label="Difficulty"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                options={['Easy', 'Medium', 'Hard']}
              />
              <Input label="Date" name="solvedAt" type="date" value={form.solvedAt} onChange={handleChange} />
            </>
          )}

          {logType === 'sql' && (
            <>
              <Input label="Topic Name" name="topicName" value={form.topicName} onChange={handleChange} required />
              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={['In Progress', 'Completed']}
              />
              <Select
                label="Confidence Level"
                name="confidenceLevel"
                value={form.confidenceLevel}
                onChange={handleChange}
                options={['Low', 'Medium', 'High']}
              />
            </>
          )}

          {logType === 'job' && (
            <>
              <Input label="Company" name="company" value={form.company} onChange={handleChange} required />
              <Input label="Role" name="role" value={form.role} onChange={handleChange} required />
              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={['Applied', 'OA', 'Interview', 'Rejected', 'Selected']}
              />
              <Input label="Applied Date" name="appliedAt" type="date" value={form.appliedAt} onChange={handleChange} />
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  </label>
);

const Select = ({ label, name, value, onChange, options }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default QuickActionModal;
