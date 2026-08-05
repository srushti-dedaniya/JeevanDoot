import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export default function CHWLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!email) nextErrors.email = 'Email is required';
    if (!password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await login(ROLES.CHW, email, password);
    setLoading(false);
    navigate('/chw/dashboard');
  };

  const illustration = (
    <div className="text-on-primary space-y-10 text-center relative z-10">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl max-w-lg">
        <h2 className="font-headline text-headline-2xl font-bold mb-4">
          Every village matters.
        </h2>
        <p className="text-body-lg opacity-80">
          JeevanDoot equips community health workers with the tools to register, survey and care for every household.
        </p>
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-primary-fixed">home_work</span>
            <p className="text-label-sm opacity-80">Households</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-primary-fixed">fact_check</span>
            <p className="text-label-sm opacity-80">Surveys</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-primary-fixed">campaign</span>
            <p className="text-label-sm opacity-80">Awareness</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout illustration={illustration}>
      <div className="flex flex-col items-center gap-6 text-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-primary shadow-elevation2 flex items-center justify-center">
          <img src="/logo.svg" alt="JeevanDoot logo" className="w-14 h-14" />
        </div>
        <div>
          <h1 className="font-headline text-headline-xl font-bold text-on-surface">Health Worker Login</h1>
          <p className="text-on-surface-variant mt-1">Welcome back, our community champions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="chw@jeevandoot.org"
          icon="mail"
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon="lock"
          error={errors.password}
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          <span className="material-symbols-outlined">login</span>
          Sign In
        </Button>
      </form>

      <p className="text-center text-label-md text-on-surface-variant mt-8">
        Demo: use <span className="font-bold text-primary">chw@jeevandoot.org</span> with any password
      </p>
    </AuthLayout>
  );
}
