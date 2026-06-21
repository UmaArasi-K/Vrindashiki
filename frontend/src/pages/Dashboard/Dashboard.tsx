import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addEntryLocal, setDailySummaries } from '../../store/footprintSlice';
import { setStreakLocal, incrementStreak } from '../../store/streakSlice';
import { setLeaderboardLocal } from '../../store/communitySlice';
import {
  generateDemoEntries,
  generateDemoSummaries,
  generateDemoStreak,
  generateDemoLeaderboard,
  getCategoryIcon,
  getCategoryColor,
} from '../../data/constants';
import Header from '../../components/Header/Header';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { entries, todayTotal, weeklyTotal, monthlyTotal, dailySummaries } =
    useAppSelector((state) => state.footprint);
  const streak = useAppSelector((state) => state.streak.streak);
  const leaderboard = useAppSelector((state) => state.community.leaderboard);

  /* Seed demo data on first load */
  useEffect(() => {
    if (entries.length === 0) {
      const demoEntries = generateDemoEntries();
      demoEntries.forEach((entry) => dispatch(addEntryLocal(entry)));
      dispatch(setDailySummaries(generateDemoSummaries()));
    }
    if (!streak) {
      dispatch(setStreakLocal(generateDemoStreak()));
    }
    if (leaderboard.length === 0) {
      dispatch(setLeaderboardLocal(generateDemoLeaderboard()));
    }
  }, []);

  /* Chart data — last 7 days */
  const chartData = dailySummaries.slice(0, 7).reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString('en', { weekday: 'short' }),
    carbon: s.totalCarbonKg,
  }));

  /* Category breakdown for today */
  const todayEntries = entries.filter(
    (e) => e.date.slice(0, 10) === new Date().toISOString().slice(0, 10)
  );
  const categoryMap: Record<string, number> = {};
  todayEntries.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.carbonKg;
  });

  /* Top leaderboard (3) */
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="dashboard-page">
      <Header
        title="Dashboard"
        subtitle="Track your impact and grow your eco-neighborhood"
      />

      {/* Stat cards */}
      <section className="dashboard-stats stagger-children" id="stats-section">
        <div className="glass-card stat-card-wrapper animate-fade-in-up">
          <div className="stat-icon-bg stat-icon-green">🌱</div>
          <div className="stat-card">
            <span className="stat-value">{todayTotal.toFixed(1)}</span>
            <span className="stat-label">kg CO₂ today</span>
          </div>
        </div>

        <div className="glass-card stat-card-wrapper animate-fade-in-up">
          <div className="stat-icon-bg stat-icon-blue">📅</div>
          <div className="stat-card">
            <span className="stat-value">{weeklyTotal.toFixed(1)}</span>
            <span className="stat-label">kg CO₂ this week</span>
          </div>
        </div>

        <div className="glass-card stat-card-wrapper animate-fade-in-up">
          <div className="stat-icon-bg stat-icon-purple">📆</div>
          <div className="stat-card">
            <span className="stat-value">{monthlyTotal.toFixed(1)}</span>
            <span className="stat-label">kg CO₂ this month</span>
          </div>
        </div>

        <div className="glass-card stat-card-wrapper animate-fade-in-up">
          <div className="stat-icon-bg stat-icon-fire">🔥</div>
          <div className="stat-card">
            <span className="stat-value animate-streak">
              {streak?.currentStreak || 0}
            </span>
            <span className="stat-label">day streak</span>
          </div>
        </div>
      </section>

      {/* Chart + Category breakdown */}
      <section className="dashboard-grid">
        {/* Weekly chart */}
        <div className="glass-card chart-card animate-fade-in-up" id="weekly-chart">
          <h2 className="card-title">Weekly Emissions</h2>
          <p className="card-subtitle">Daily carbon footprint (kg CO₂)</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="carbon"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#carbonGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card category-card animate-fade-in-up" id="category-breakdown">
          <h2 className="card-title">Today's Breakdown</h2>
          <p className="card-subtitle">Carbon by category</p>
          <div className="category-list">
            {Object.entries(categoryMap).length === 0 ? (
              <p className="text-muted text-sm" style={{ padding: 'var(--space-4)' }}>
                No entries today. Start tracking!
              </p>
            ) : (
              Object.entries(categoryMap)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, value]) => (
                  <div className="category-item" key={cat}>
                    <div className="category-item-left">
                      <span className="category-icon">{getCategoryIcon(cat)}</span>
                      <span className="category-name">{cat}</span>
                    </div>
                    <div className="category-item-right">
                      <span
                        className="category-value"
                        style={{ color: getCategoryColor(cat) }}
                      >
                        {value.toFixed(1)} kg
                      </span>
                      <div className="category-bar">
                        <div
                          className="category-bar-fill"
                          style={{
                            width: `${Math.min(100, (value / (todayTotal || 1)) * 100)}%`,
                            background: getCategoryColor(cat),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Leaderboard preview + Neighborhood preview */}
      <section className="dashboard-bottom-grid">
        {/* Leaderboard mini */}
        <div className="glass-card leaderboard-mini animate-fade-in-up" id="leaderboard-preview">
          <h2 className="card-title">🏆 Leaderboard</h2>
          <div className="leaderboard-podium">
            {topThree.map((member, i) => (
              <div
                className={`podium-member podium-${i + 1}`}
                key={member.userId}
              >
                <div className="podium-avatar">
                  <div className="avatar avatar-lg">
                    {member.displayName.charAt(0)}
                  </div>
                  <span className="podium-rank">
                    {i === 0 ? '👑' : i === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
                <span className="podium-name">{member.displayName}</span>
                <span className="podium-points">{member.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood gamification preview */}
        <div className="glass-card neighborhood-card animate-fade-in-up" id="neighborhood-preview">
          <h2 className="card-title">🏘️ Your Neighborhood</h2>
          <p className="card-subtitle">Grow your eco-village by reducing emissions!</p>
          <div className="neighborhood-scene">
            <div className="neighborhood-ground" />
            <div className="neighborhood-buildings stagger-children">
              <div className="building building-1 animate-scale-in">🏠</div>
              <div className="building building-2 animate-scale-in">🌳</div>
              <div className="building building-3 animate-scale-in">🏡</div>
              <div className="building building-4 animate-scale-in">🌻</div>
              <div className="building building-5 animate-scale-in">🏢</div>
              {(streak?.level || 0) >= 3 && (
                <div className="building building-6 animate-scale-in">🏰</div>
              )}
              {(streak?.level || 0) >= 5 && (
                <div className="building building-7 animate-scale-in">🌈</div>
              )}
            </div>
            <div className="neighborhood-level">
              <span className="badge badge-accent">Level {streak?.level || 1} Village</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="glass-card recent-activity animate-fade-in-up" id="recent-activity">
        <h2 className="card-title">Recent Activity</h2>
        <div className="activity-list">
          {entries.slice(0, 5).map((entry) => (
            <div className="activity-item" key={entry.id}>
              <span className="activity-icon">{getCategoryIcon(entry.category)}</span>
              <div className="activity-details">
                <span className="activity-name">{entry.activity}</span>
                <span className="activity-meta">
                  {entry.quantity} {entry.unit} · {entry.date}
                </span>
              </div>
              <span
                className="activity-carbon"
                style={{ color: getCategoryColor(entry.category) }}
              >
                {entry.carbonKg.toFixed(2)} kg
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
