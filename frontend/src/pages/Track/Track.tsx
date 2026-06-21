import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addEntryLocal, removeEntryLocal } from '../../store/footprintSlice';
import { incrementStreak, addPoints } from '../../store/streakSlice';
import {
  ACTIVITY_CATALOG,
  getCategoryIcon,
  getCategoryColor,
} from '../../data/constants';
import Header from '../../components/Header/Header';
import type { EmissionCategory, FootprintEntry } from '../../types';
import './Track.css';

const CATEGORIES: EmissionCategory[] = ['transport', 'food', 'energy', 'shopping', 'waste'];

export default function TrackPage() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.footprint.entries);

  const [selectedCategory, setSelectedCategory] = useState<EmissionCategory>('transport');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredActivities = useMemo(
    () => ACTIVITY_CATALOG.filter((a) => a.category === selectedCategory),
    [selectedCategory]
  );

  const selectedActivityData = useMemo(
    () => ACTIVITY_CATALOG.find((a) => a.activity === selectedActivity),
    [selectedActivity]
  );

  const calculatedCarbon = useMemo(() => {
    if (!selectedActivityData || !quantity) return 0;
    return Math.round(parseFloat(quantity) * selectedActivityData.carbonPerUnit * 100) / 100;
  }, [selectedActivityData, quantity]);

  /* Reset activity when category changes */
  const handleCategoryChange = (cat: EmissionCategory) => {
    setSelectedCategory(cat);
    setSelectedActivity('');
    setQuantity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !quantity || parseFloat(quantity) <= 0) return;

    const entry: FootprintEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: 'demo-user',
      date: new Date().toISOString().slice(0, 10),
      category: selectedCategory,
      activity: selectedActivity,
      quantity: parseFloat(quantity),
      unit: selectedActivityData?.unit || '',
      carbonKg: calculatedCarbon,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch(addEntryLocal(entry));
    dispatch(incrementStreak());
    dispatch(addPoints(Math.max(5, Math.round(10 - calculatedCarbon))));

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setSelectedActivity('');
    setQuantity('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    dispatch(removeEntryLocal(id));
  };

  /* Today's entries */
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((e) => e.date.slice(0, 10) === todayStr);

  return (
    <div className="track-page">
      <Header
        title="Track Emissions"
        subtitle="Log your daily carbon footprint activities"
      />

      {/* Success toast */}
      {showSuccess && (
        <div className="success-toast animate-slide-right" id="success-toast">
          <span>✅</span>
          <span>Entry logged! +{Math.max(5, Math.round(10 - calculatedCarbon))} eco points earned</span>
        </div>
      )}

      <div className="track-layout">
        {/* Input form */}
        <div className="glass-card track-form animate-fade-in-up" id="track-form">
          <h2 className="card-title">Log Activity</h2>
          <p className="card-subtitle">Select a category and activity to calculate emissions</p>

          <form onSubmit={handleSubmit}>
            {/* Category selector */}
            <div className="category-selector" id="category-selector">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? 'category-chip--active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    '--chip-color': getCategoryColor(cat),
                  } as React.CSSProperties}
                >
                  <span>{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Activity selector */}
            <div className="input-group">
              <label htmlFor="activity-select">Activity</label>
              <select
                id="activity-select"
                className="select-field"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                required
              >
                <option value="">Choose an activity…</option>
                {filteredActivities.map((a) => (
                  <option key={a.activity} value={a.activity}>
                    {a.icon} {a.activity} ({a.carbonPerUnit} kg CO₂/{a.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="input-group">
              <label htmlFor="quantity-input">
                Quantity {selectedActivityData ? `(${selectedActivityData.unit})` : ''}
              </label>
              <input
                type="number"
                id="quantity-input"
                className="input-field"
                placeholder="Enter amount"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Live carbon calc */}
            {calculatedCarbon > 0 && (
              <div className="carbon-preview animate-scale-in" id="carbon-preview">
                <div className="carbon-preview-label">Estimated Carbon Emission</div>
                <div className="carbon-preview-value">
                  {calculatedCarbon.toFixed(2)} <span>kg CO₂</span>
                </div>
                <div className="carbon-preview-bar">
                  <div
                    className="carbon-preview-bar-fill"
                    style={{
                      width: `${Math.min(100, (calculatedCarbon / 10) * 100)}%`,
                      background:
                        calculatedCarbon < 2
                          ? 'var(--gradient-primary)'
                          : calculatedCarbon < 5
                          ? 'var(--gradient-fire)'
                          : 'var(--color-danger)',
                    }}
                  />
                </div>
                <div className="carbon-preview-guide">
                  {calculatedCarbon < 2 && '🌱 Low impact — great choice!'}
                  {calculatedCarbon >= 2 && calculatedCarbon < 5 && '⚠️ Moderate impact'}
                  {calculatedCarbon >= 5 && '🔴 High impact — consider alternatives'}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="input-group">
              <label htmlFor="notes-input">Notes (optional)</label>
              <input
                type="text"
                id="notes-input"
                className="input-field"
                placeholder="Add a note…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg track-submit" id="btn-log-entry">
              🌿 Log Entry
            </button>
          </form>
        </div>

        {/* Today's log */}
        <div className="glass-card today-log animate-fade-in-up" id="today-log">
          <h2 className="card-title">Today's Log</h2>
          <p className="card-subtitle">{todayStr}</p>

          {todayEntries.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No entries yet today. Start logging!</p>
            </div>
          ) : (
            <div className="today-entries">
              {todayEntries.map((entry) => (
                <div className="today-entry" key={entry.id}>
                  <div className="today-entry-left">
                    <span className="today-entry-icon">{getCategoryIcon(entry.category)}</span>
                    <div className="today-entry-info">
                      <span className="today-entry-name">{entry.activity}</span>
                      <span className="today-entry-qty">
                        {entry.quantity} {entry.unit}
                      </span>
                    </div>
                  </div>
                  <div className="today-entry-right">
                    <span
                      className="today-entry-carbon"
                      style={{ color: getCategoryColor(entry.category) }}
                    >
                      {entry.carbonKg.toFixed(2)} kg
                    </span>
                    <button
                      className="today-entry-delete"
                      onClick={() => handleDelete(entry.id)}
                      title="Remove entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="today-total">
                <span>Total</span>
                <span className="today-total-value">
                  {todayEntries.reduce((s, e) => s + e.carbonKg, 0).toFixed(2)} kg CO₂
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
