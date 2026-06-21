import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setStreakLocal } from '../../store/streakSlice';
import { generateDemoStreak, BADGE_DEFINITIONS } from '../../data/constants';
import Header from '../../components/Header/Header';
import './Streaks.css';

export default function StreaksPage() {
  const dispatch = useAppDispatch();
  const streak = useAppSelector((state) => state.streak.streak);

  useEffect(() => {
    if (!streak) {
      dispatch(setStreakLocal(generateDemoStreak()));
    }
  }, []);

  if (!streak) return null;

  const levelProgress = (streak.totalPoints % 100);

  return (
    <div className="streaks-page">
      <Header title="Streaks & Badges" subtitle="Keep your momentum going!" />

      {/* Streak Hero */}
      <section className="glass-card streak-hero animate-fade-in-up" id="streak-hero">
        <div className="streak-hero-visual">
          <div className="streak-ring">
            <svg viewBox="0 0 120 120" className="streak-ring-svg">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="url(#streakGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(streak.currentStreak / streak.longestStreak) * 327} 327`}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="streakGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="streak-ring-content">
              <span className="streak-ring-number animate-streak">{streak.currentStreak}</span>
              <span className="streak-ring-label">days</span>
            </div>
          </div>
        </div>

        <div className="streak-hero-info">
          <div className="streak-stats-row">
            <div className="streak-stat">
              <span className="streak-stat-value">{streak.currentStreak}</span>
              <span className="streak-stat-label">Current Streak</span>
            </div>
            <div className="streak-stat">
              <span className="streak-stat-value">{streak.longestStreak}</span>
              <span className="streak-stat-label">Longest Streak</span>
            </div>
            <div className="streak-stat">
              <span className="streak-stat-value">{streak.totalPoints}</span>
              <span className="streak-stat-label">Eco Points</span>
            </div>
            <div className="streak-stat">
              <span className="streak-stat-value">Lv {streak.level}</span>
              <span className="streak-stat-label">Level</span>
            </div>
          </div>

          {/* Level progress */}
          <div className="level-progress-section">
            <div className="level-progress-header">
              <span className="text-sm text-secondary">Progress to Level {streak.level + 1}</span>
              <span className="text-sm text-accent font-semibold">{levelProgress}/100 pts</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <section className="badges-section animate-fade-in-up" id="badges-section">
        <h2 className="section-title">🏅 Badges</h2>
        <p className="section-subtitle">Unlock badges by reaching milestones</p>

        <div className="badges-grid stagger-children">
          {streak.badges.map((badge) => (
            <div
              className={`glass-card badge-card animate-scale-in ${
                badge.isUnlocked ? 'badge-card--unlocked' : 'badge-card--locked'
              }`}
              key={badge.id}
              id={`badge-${badge.id}`}
            >
              <div className="badge-icon-wrapper">
                <span className={`badge-icon ${badge.isUnlocked ? '' : 'badge-icon--locked'}`}>
                  {badge.icon}
                </span>
                {badge.isUnlocked && (
                  <span className="badge-check">✓</span>
                )}
              </div>
              <h3 className="badge-name">{badge.name}</h3>
              <p className="badge-description">{badge.description}</p>
              <span className={`badge badge-${badge.tier}`}>
                {badge.tier}
              </span>
              {badge.isUnlocked && badge.unlockedAt && (
                <span className="badge-date">
                  {new Date(badge.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Streak Tips */}
      <section className="glass-card streak-tips animate-fade-in-up" id="streak-tips">
        <h2 className="card-title">💡 Tips to Keep Your Streak</h2>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🚲</span>
            <div>
              <strong>Choose eco-transport</strong>
              <p>Walk, bike, or use public transit when possible</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🥗</span>
            <div>
              <strong>Eat more plant-based</strong>
              <p>Vegetarian meals can reduce food emissions by 50%</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Monitor energy usage</strong>
              <p>Turn off unused lights and appliances</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">♻️</span>
            <div>
              <strong>Reduce, reuse, recycle</strong>
              <p>Composting and recycling dramatically cut waste emissions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
