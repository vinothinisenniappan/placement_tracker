import { useState, useEffect } from 'react';
import api from '../services/api';

const initialForms = {
  coding: {
    quantity: 1,
    problemNames: [''],
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(initialForms[logType]);
      setError('');
    }
  }, [isOpen, logType]);

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

  const handleQuantityChange = (event) => {
    const qty = Math.max(1, parseInt(event.target.value, 10) || 1);
    setForm((prev) => {
      const currentNames = prev.problemNames || [prev.problemName || ''];
      const nextNames = [...currentNames];
      while (nextNames.length < qty) {
        nextNames.push('');
      }
      if (nextNames.length > qty) {
        nextNames.splice(qty);
      }
      return {
        ...prev,
        quantity: qty,
        problemNames: nextNames,
        problemName: nextNames[0] || '',
      };
    });
  };

  const handleProblemNameChange = (index, value) => {
    setForm((prev) => {
      const nextNames = [...(prev.problemNames || [''])];
      nextNames[index] = value;
      return {
        ...prev,
        problemNames: nextNames,
        problemName: nextNames[0] || '',
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (logType === 'coding') {
        const qty = form.quantity || 1;
        const names = form.problemNames || [form.problemName || ''];
        const baseName = names[0]?.trim() || 'Coding Problem';

        const promises = [];
        for (let i = 0; i < qty; i++) {
          const pName = names[i]?.trim() || (i === 0 ? baseName : `${baseName} (${i + 1})`);
          promises.push(
            api.post('/coding', {
              problemName: pName,
              platform: form.platform,
              difficulty: form.difficulty,
              solvedAt: form.solvedAt,
            })
          );
        }
        await Promise.all(promises);
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
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-card-hover">
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
              <Input
                label="Number of Problems Solved"
                name="quantity"
                type="number"
                min="1"
                max="15"
                value={form.quantity || 1}
                onChange={handleQuantityChange}
                required
              />
              {(form.problemNames || ['']).map((name, index) => (
                <Input
                  key={index}
                  label={form.quantity > 1 ? `Problem Name #${index + 1}` : "Problem Name"}
                  name={`problemName_${index}`}
                  value={name}
                  onChange={(e) => handleProblemNameChange(index, e.target.value)}
                  required={index === 0}
                  placeholder={index > 0 ? `e.g. Problem Name (defaults to "${form.problemNames[0] || 'Coding Problem'} (${index + 1})")` : "e.g. Two Sum"}
                />
              ))}
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

const Input = ({ label, name, value, onChange, type = 'text', required = false, ...props }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      {...props}
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
