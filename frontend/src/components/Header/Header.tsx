import { useAppSelector } from '../../store/hooks';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const streak = useAppSelector((state) => state.streak.streak);

  return (
    <header className="page-header" id="page-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {streak && (
          <div className="header-streak-pill" id="header-streak">
            <span className="streak-fire animate-streak">🔥</span>
            <span className="streak-count">{streak.currentStreak}</span>
            <span className="streak-label">day streak</span>
          </div>
        )}

        {streak && (
          <div className="header-level-pill">
            <span className="level-icon">⭐</span>
            <span className="level-value">Lv {streak.level}</span>
          </div>
        )}
      </div>
    </header>
  );
}
