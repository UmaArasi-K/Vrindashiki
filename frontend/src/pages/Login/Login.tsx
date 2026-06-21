import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDemoUser } from '../../store/authSlice';
import type { User } from '../../types';
import './Login.css';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /* In demo mode, create a local user */
    const demoUser: User = {
      id: 'demo-user',
      email: email || 'demo@vrindashiki.app',
      displayName: displayName || email.split('@')[0] || 'Eco Warrior',
      createdAt: new Date().toISOString(),
      preferences: {
        shareStreaksPublicly: true,
        enableNotifications: true,
        fitnessIntegrationConsent: false,
        measurementUnit: 'metric',
      },
    };

    dispatch(setDemoUser(demoUser));
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@vrindashiki.app',
      displayName: 'Demo User',
      createdAt: '2025-01-15T00:00:00.000Z',
      preferences: {
        shareStreaksPublicly: true,
        enableNotifications: true,
        fitnessIntegrationConsent: false,
        measurementUnit: 'metric',
      },
    };
    dispatch(setDemoUser(demoUser));
  };

  return (
    <div className="login-page" id="login-page">
      {/* Ambient background effects */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <div className="login-container animate-scale-in">
        {/* Brand header */}
        <div className="login-brand">
          <span className="login-brand-icon animate-float">🌿</span>
          <h1 className="login-brand-name">Vrindashiki</h1>
          <p className="login-brand-tagline">Track your carbon footprint. Grow your neighborhood.</p>
        </div>

        {/* Form card */}
        <div className="login-card">
          <div className="login-tabs">
            <button
              className={`login-tab ${!isSignup ? 'login-tab--active' : ''}`}
              onClick={() => setIsSignup(false)}
              id="tab-login"
            >
              Sign In
            </button>
            <button
              className={`login-tab ${isSignup ? 'login-tab--active' : ''}`}
              onClick={() => setIsSignup(true)}
              id="tab-signup"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="input-group">
                <label htmlFor="input-name">Display Name</label>
                <input
                  type="text"
                  id="input-name"
                  className="input-field"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignup}
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="input-email">Email</label>
              <input
                type="email"
                id="input-email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="input-password">Password</label>
              <input
                type="password"
                id="input-password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="login-error">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={isLoading}
              id="btn-submit"
            >
              {isLoading
                ? 'Please wait…'
                : isSignup
                ? '🌱 Create Account'
                : '🌿 Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button
            className="btn btn-secondary btn-lg login-demo"
            onClick={handleDemoLogin}
            id="btn-demo"
          >
            🚀 Try Demo (No Account Needed)
          </button>

          <p className="login-privacy">
            🔒 Your data is encrypted and never sold.
            <br />
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
