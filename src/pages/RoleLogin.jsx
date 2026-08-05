import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { APP_NAME, REGISTRATION_ROLES, ROLE_META, ROLE_PORTAL } from '../utils/constants';

export default function RoleLogin() {
  const { role } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notify } = useNotification();

  if (!REGISTRATION_ROLES.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  const meta = ROLE_META[role];

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await login(role, email, password);
    setLoading(false);

    notify({ type: 'success', message: `Welcome back!` });
    navigate(ROLE_PORTAL[role] ?? '/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <nav className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/40">
        <div className="max-w-3xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <img src="/logo.svg" alt={`${APP_NAME} logo`} className="w-7 h-7" />
            </div>
            <div className="leading-tight">
              <p className="font-headline text-title-md font-bold">{APP_NAME}</p>
              <p className="text-label-sm text-on-surface-variant">Sign in</p>
            </div>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-md font-semibold text-on-surface-variant hover:text-primary hover:bg-primary-fixed/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Choose a role
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 py-10 md:py-14">
        <div className="bg-surface-container-lowest rounded-xl card-shadow border border-outline-variant/20 p-8 md:p-10 space-y-6">
          <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${meta.color}`}>
              <span className="material-symbols-outlined text-3xl">{meta.icon}</span>
            </div>
            <h1 className="font-headline text-headline-lg font-bold mt-4">Sign in as {meta.label}</h1>
            <p className="text-on-surface-variant mt-1">Welcome back to {APP_NAME}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon="mail"
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon="lock"
              error={errors.password}
              autoComplete="current-password"
              rightAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-on-surface-variant hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />

            <Button type="submit" fullWidth size="lg" loading={loading} icon="login">
              Sign In
            </Button>
          </form>

          <p className="text-center text-label-md text-on-surface-variant">
            Demo: any email with any password works
          </p>

          <div className="border-t border-outline-variant pt-5 text-center space-y-2 text-label-md">
            <p className="text-on-surface-variant">
              New here?{' '}
              <Link to={`/register?role=${role}`} className="font-bold text-primary hover:underline">
                Create an account as {meta.label}
              </Link>
            </p>
            <p>
              <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors">
                Choose a different role
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}