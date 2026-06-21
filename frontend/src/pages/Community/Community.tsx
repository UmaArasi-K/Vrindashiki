import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setLeaderboardLocal, setChallengesLocal } from '../../store/communitySlice';
import { generateDemoLeaderboard, generateDemoChallenges } from '../../data/constants';
import Header from '../../components/Header/Header';
import './Community.css';

export default function CommunityPage() {
  const dispatch = useAppDispatch();
  const { leaderboard, challenges } = useAppSelector((state) => state.community);

  useEffect(() => {
    if (leaderboard.length === 0) {
      dispatch(setLeaderboardLocal(generateDemoLeaderboard()));
    }
    if (challenges.length === 0) {
      dispatch(setChallengesLocal(generateDemoChallenges()));
    }
  }, []);

  return (
    <div className="community-page">
      <Header title="Community" subtitle="Compete, collaborate, and grow your neighborhood" />

      <div className="community-layout">
        {/* Leaderboard */}
        <section className="glass-card leaderboard-section animate-fade-in-up" id="leaderboard-section">
          <h2 className="card-title">🏆 Eco Leaderboard</h2>
          <p className="card-subtitle">Top contributors in your community</p>

          <div className="leaderboard-table">
            <div className="leaderboard-header">
              <span className="lb-col-rank">Rank</span>
              <span className="lb-col-user">User</span>
              <span className="lb-col-streak">Streak</span>
              <span className="lb-col-points">Points</span>
              <span className="lb-col-level">Level</span>
            </div>
            {leaderboard.map((member) => (
              <div
                className={`leaderboard-row ${member.userId === 'demo-user' ? 'leaderboard-row--you' : ''}`}
                key={member.userId}
              >
                <span className="lb-col-rank">
                  {member.rank <= 3 ? (
                    <span className="lb-rank-badge">
                      {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="lb-rank-number">{member.rank}</span>
                  )}
                </span>
                <span className="lb-col-user">
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                    {member.displayName.charAt(0)}
                  </div>
                  <span className="lb-user-name">
                    {member.displayName}
                    {member.userId === 'demo-user' && (
                      <span className="badge badge-accent" style={{ marginLeft: 8 }}>You</span>
                    )}
                  </span>
                </span>
                <span className="lb-col-streak">
                  <span className="lb-streak-fire">🔥</span>
                  {member.currentStreak}
                </span>
                <span className="lb-col-points">{member.totalPoints}</span>
                <span className="lb-col-level">
                  <span className="badge badge-purple">Lv {member.level}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="challenges-section animate-fade-in-up" id="challenges-section">
          <h2 className="section-title">🎯 Neighborhood Challenges</h2>
          <p className="section-subtitle">Join challenges to earn bonus points</p>

          <div className="challenges-list stagger-children">
            {challenges.map((challenge) => {
              const progressPct = Math.min(100, (challenge.currentProgress / challenge.targetCarbonReduction) * 100);
              const daysLeft = Math.max(0, Math.ceil(
                (new Date(challenge.endDate).getTime() - Date.now()) / 86400000
              ));

              return (
                <div
                  className={`glass-card challenge-card animate-fade-in-up ${
                    !challenge.isActive ? 'challenge-card--completed' : ''
                  }`}
                  key={challenge.id}
                  id={`challenge-${challenge.id}`}
                >
                  <div className="challenge-header">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    {challenge.isActive ? (
                      <span className="badge badge-accent">Active</span>
                    ) : (
                      <span className="badge badge-sky">Completed</span>
                    )}
                  </div>

                  <p className="challenge-description">{challenge.description}</p>

                  <div className="challenge-progress">
                    <div className="challenge-progress-header">
                      <span className="text-sm text-secondary">
                        {challenge.currentProgress}/{challenge.targetCarbonReduction} kg CO₂ reduced
                      </span>
                      <span className="text-sm font-semibold text-accent">
                        {progressPct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progressPct}%`,
                          background: progressPct >= 100
                            ? 'var(--gradient-primary)'
                            : 'var(--gradient-fire)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="challenge-meta">
                    <span className="challenge-participants">
                      👥 {challenge.participants} participants
                    </span>
                    {challenge.isActive && (
                      <span className="challenge-time">
                        ⏰ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </span>
                    )}
                  </div>

                  {challenge.isActive && (
                    <button className="btn btn-primary challenge-join" id={`join-${challenge.id}`}>
                      Join Challenge
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
