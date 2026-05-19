import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const API_BASE_DEFAULT = '/api';

function normalizeBase(base: string) {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function getApiBase() {
  return normalizeBase(process.env.REACT_APP_API_BASE || API_BASE_DEFAULT);
}

function saveToken(token: string) {
  localStorage.setItem('ajiva_token', token);
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const s = new URLSearchParams(location.search);
    return s.get('from') || '/crm/dashboard';
  }, [location.search]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${getApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Login failed');
        return;
      }

      saveToken(data.token);
      navigate(from, { replace: true });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary-900 text-white">
      <div className="container-custom py-10">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center">
                  <span className="font-bold text-lg">AG</span>
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-lg">CRM Login</div>
                  <div className="text-sm text-white/70">Ajiva Global Logistics</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-white/85">
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="text-sm">Sign in to manage deals and shipments</span>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-lg bg-secondary-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Signing in…' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/0 px-6 py-3 font-semibold text-white/90 hover:bg-white/5 transition-colors"
                >
                  Back to Website
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/55">
            Authorized users only. Access is role-based and audited.
          </div>
        </div>
      </div>
    </div>
  );
}
