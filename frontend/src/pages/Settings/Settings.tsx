import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserPreferences, logout } from '../../store/authSlice';
import Header from '../../components/Header/Header';
import './Settings.css';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [showConsentModal, setShowConsentModal] = useState(false);

  if (!user) return null;

  const handleToggle = (key: keyof typeof user.preferences, value: boolean) => {
    /* Fitness integration requires explicit consent dialog */
    if (key === 'fitnessIntegrationConsent' && value) {
      setShowConsentModal(true);
      return;
    }
    dispatch(updateUserPreferences({ [key]: value }));
  };

  const handleFitnessConsent = () => {
    dispatch(updateUserPreferences({ fitnessIntegrationConsent: true }));
    setShowConsentModal(false);
  };

  return (
    <div className="settings-page">
      <Header title="Settings" subtitle="Manage your profile and privacy" />

      {/* Profile section */}
      <section className="glass-card settings-section animate-fade-in-up" id="profile-section">
        <h2 className="settings-section-title">👤 Profile</h2>
        <div className="settings-profile">
          <div className="avatar avatar-xl">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="settings-profile-info">
            <h3 className="settings-profile-name">{user.displayName}</h3>
            <p className="settings-profile-email">{user.email}</p>
            <p className="settings-profile-joined">
              Joined {new Date(user.createdAt).toLocaleDateString('en', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy section — CRITICAL */}
      <section className="glass-card settings-section animate-fade-in-up" id="privacy-section">
        <h2 className="settings-section-title">🔒 Privacy & Data</h2>
        <p className="settings-section-desc">
          Your privacy is paramount. We only collect data you explicitly choose to share.
        </p>

        <div className="settings-toggles">
          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Share streaks publicly</span>
              <span className="toggle-desc">Allow your streak to appear on the community leaderboard</span>
            </div>
            <button
              className={`toggle-switch ${user.preferences.shareStreaksPublicly ? 'toggle-switch--on' : ''}`}
              onClick={() => handleToggle('shareStreaksPublicly', !user.preferences.shareStreaksPublicly)}
              role="switch"
              aria-checked={user.preferences.shareStreaksPublicly}
              id="toggle-share-streaks"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Enable notifications</span>
              <span className="toggle-desc">Receive streak reminders and challenge updates</span>
            </div>
            <button
              className={`toggle-switch ${user.preferences.enableNotifications ? 'toggle-switch--on' : ''}`}
              onClick={() => handleToggle('enableNotifications', !user.preferences.enableNotifications)}
              role="switch"
              aria-checked={user.preferences.enableNotifications}
              id="toggle-notifications"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Fitness device integration</span>
              <span className="toggle-desc">
                Connect Google Fit or Apple Health for automatic activity tracking.
                <strong className="privacy-notice"> Requires explicit consent. Your health data is never sold or shared.</strong>
              </span>
            </div>
            <button
              className={`toggle-switch ${user.preferences.fitnessIntegrationConsent ? 'toggle-switch--on' : ''}`}
              onClick={() => handleToggle('fitnessIntegrationConsent', !user.preferences.fitnessIntegrationConsent)}
              role="switch"
              aria-checked={user.preferences.fitnessIntegrationConsent}
              id="toggle-fitness"
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </section>

      {/* Measurement */}
      <section className="glass-card settings-section animate-fade-in-up" id="measurement-section">
        <h2 className="settings-section-title">📏 Measurement Unit</h2>
        <div className="unit-selector">
          <button
            className={`unit-option ${user.preferences.measurementUnit === 'metric' ? 'unit-option--active' : ''}`}
            onClick={() => dispatch(updateUserPreferences({ measurementUnit: 'metric' }))}
            id="unit-metric"
          >
            Metric (kg, km)
          </button>
          <button
            className={`unit-option ${user.preferences.measurementUnit === 'imperial' ? 'unit-option--active' : ''}`}
            onClick={() => dispatch(updateUserPreferences({ measurementUnit: 'imperial' }))}
            id="unit-imperial"
          >
            Imperial (lbs, mi)
          </button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="glass-card settings-section settings-danger animate-fade-in-up" id="danger-zone">
        <h2 className="settings-section-title">⚠️ Account</h2>
        <div className="danger-actions">
          <button className="btn btn-secondary" onClick={() => dispatch(logout())} id="btn-signout">
            Sign Out
          </button>
          <button className="btn btn-danger" id="btn-delete-account">
            Delete Account
          </button>
        </div>
      </section>

      {/* Fitness Consent Modal */}
      {showConsentModal && (
        <div className="modal-overlay animate-fade-in" id="consent-modal">
          <div className="glass-card modal-content animate-scale-in">
            <h2 className="modal-title">🏃 Fitness Integration Consent</h2>
            <div className="modal-body">
              <p>By enabling fitness integration, you consent to the following:</p>
              <ul className="consent-list">
                <li>✅ We will access step count, distance, and activity data from your fitness device</li>
                <li>✅ This data is used <strong>only</strong> to calculate your carbon footprint more accurately</li>
                <li>✅ Your health data is encrypted in transit and at rest</li>
                <li>✅ We will <strong>never</strong> sell, share, or use your health data for advertising</li>
                <li>✅ You can revoke this consent at any time from settings</li>
              </ul>
              <p className="consent-legal">
                By clicking "I Agree", you provide explicit, informed consent for Vrindashiki to
                access your fitness data as described above.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConsentModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleFitnessConsent}
                id="btn-consent-agree"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
