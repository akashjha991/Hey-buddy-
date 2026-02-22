import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.token);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden bg-accent p-10 text-white md:block">
          <h1 className="text-4xl font-bold">Sports Buddy</h1>
          <p className="mt-4 text-slate-300">
            Find players near you, create local sports rooms, and chat in realtime.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li>• Discover nearby matches with geo search</li>
            <li>• Join securely with protected slot locking</li>
            <li>• Coordinate with instant room chat</li>
          </ul>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-800">{isRegister ? 'Create account' : 'Welcome back'}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isRegister ? 'Start your first sports meetup today.' : 'Login to continue to your dashboard.'}
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {isRegister && (
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand"
                placeholder="Your name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            )}
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand"
              placeholder="Email"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-brand"
              placeholder="Password"
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <button
              className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
            </button>
          </form>

          <button
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={() => setIsRegister((p) => !p)}
            type="button"
          >
            {isRegister ? 'Already have an account? Login' : 'New here? Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};
