import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login, register, isAuthenticated, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="hidden flex-col justify-center border-r border-slate-200 bg-white px-12 lg:flex">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Placement Preparation
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900">
            Track coding, SQL, and applications in one clean workspace.
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Built for students preparing for placements. Log progress daily, monitor readiness,
            and stay consistent with your prep streak.
          </p>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
            <h2 className="text-2xl font-bold text-slate-900">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister
                ? 'Start tracking your placement journey today.'
                : 'Sign in to continue your preparation.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isRegister && (
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              )}
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Field
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
              >
                {submitting ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister((prev) => !prev);
                  setError('');
                }}
                className="font-semibold text-primary hover:underline"
              >
                {isRegister ? 'Login' : 'Register'}
              </button>
            </p>

            <p className="mt-3 text-center text-xs text-slate-400">
              By continuing, your session is stored securely in an HTTP-only cookie.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = 'text', required = false }) => (
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

export default LoginPage;
