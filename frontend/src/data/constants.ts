/**
 * Carbon Emission Factors — realistic kg CO₂ per unit.
 * Sources: EPA, DEFRA, and Carbon Trust emission factor databases.
 * Used for calculating carbon footprint from user activities.
 */
import type { ActivityOption, FootprintEntry, Streak, CommunityMember, NeighborhoodChallenge, DailySummary, Badge } from '../types';

/* ============================
   Activity Catalog
   ============================ */
export const ACTIVITY_CATALOG: ActivityOption[] = [
  // Transport
  { category: 'transport', activity: 'Car (petrol)', unit: 'km', carbonPerUnit: 0.21, icon: '🚗' },
  { category: 'transport', activity: 'Car (diesel)', unit: 'km', carbonPerUnit: 0.17, icon: '🚙' },
  { category: 'transport', activity: 'Car (electric)', unit: 'km', carbonPerUnit: 0.05, icon: '⚡' },
  { category: 'transport', activity: 'Bus', unit: 'km', carbonPerUnit: 0.089, icon: '🚌' },
  { category: 'transport', activity: 'Train', unit: 'km', carbonPerUnit: 0.041, icon: '🚆' },
  { category: 'transport', activity: 'Bicycle / Walking', unit: 'km', carbonPerUnit: 0.0, icon: '🚲' },
  { category: 'transport', activity: 'Domestic Flight', unit: 'km', carbonPerUnit: 0.255, icon: '✈️' },
  { category: 'transport', activity: 'Motorcycle', unit: 'km', carbonPerUnit: 0.103, icon: '🏍️' },

  // Food
  { category: 'food', activity: 'Beef meal', unit: 'serving', carbonPerUnit: 6.61, icon: '🥩' },
  { category: 'food', activity: 'Chicken meal', unit: 'serving', carbonPerUnit: 3.1, icon: '🍗' },
  { category: 'food', activity: 'Vegetarian meal', unit: 'serving', carbonPerUnit: 1.7, icon: '🥗' },
  { category: 'food', activity: 'Vegan meal', unit: 'serving', carbonPerUnit: 0.9, icon: '🌱' },
  { category: 'food', activity: 'Fish meal', unit: 'serving', carbonPerUnit: 3.49, icon: '🐟' },
  { category: 'food', activity: 'Dairy (milk)', unit: 'litre', carbonPerUnit: 1.39, icon: '🥛' },

  // Energy
  { category: 'energy', activity: 'Electricity (grid)', unit: 'kWh', carbonPerUnit: 0.42, icon: '💡' },
  { category: 'energy', activity: 'Natural Gas (heating)', unit: 'kWh', carbonPerUnit: 0.18, icon: '🔥' },
  { category: 'energy', activity: 'Solar Panel', unit: 'kWh', carbonPerUnit: 0.0, icon: '☀️' },
  { category: 'energy', activity: 'Air Conditioning', unit: 'hours', carbonPerUnit: 0.95, icon: '❄️' },

  // Shopping
  { category: 'shopping', activity: 'Clothing item', unit: 'item', carbonPerUnit: 10.0, icon: '👕' },
  { category: 'shopping', activity: 'Electronics', unit: 'item', carbonPerUnit: 50.0, icon: '📱' },
  { category: 'shopping', activity: 'Groceries (packaged)', unit: 'kg', carbonPerUnit: 1.5, icon: '🛒' },
  { category: 'shopping', activity: 'Online order delivery', unit: 'package', carbonPerUnit: 3.5, icon: '📦' },

  // Waste
  { category: 'waste', activity: 'General waste', unit: 'kg', carbonPerUnit: 0.58, icon: '🗑️' },
  { category: 'waste', activity: 'Recycling', unit: 'kg', carbonPerUnit: 0.02, icon: '♻️' },
  { category: 'waste', activity: 'Composting', unit: 'kg', carbonPerUnit: 0.01, icon: '🌿' },
];

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    transport: '🚗',
    food: '🍽️',
    energy: '⚡',
    shopping: '🛍️',
    waste: '♻️',
  };
  return icons[category] || '📊';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    transport: 'var(--color-sky)',
    food: 'var(--color-fire)',
    energy: 'var(--color-accent)',
    shopping: 'var(--color-purple)',
    waste: 'var(--color-teal)',
  };
  return colors[category] || 'var(--color-accent)';
}

/* ============================
   Badge Definitions
   ============================ */
export const BADGE_DEFINITIONS: Badge[] = [
  { id: 'first-log', name: 'First Step', description: 'Log your first carbon entry', icon: '🌱', isUnlocked: false, tier: 'bronze' },
  { id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', isUnlocked: false, tier: 'bronze' },
  { id: 'month-streak', name: 'Monthly Champion', description: 'Maintain a 30-day streak', icon: '💎', isUnlocked: false, tier: 'silver' },
  { id: 'eco-hero', name: 'Eco Hero', description: 'Reduce emissions by 50% in a week', icon: '🦸', isUnlocked: false, tier: 'gold' },
  { id: 'community-leader', name: 'Community Leader', description: 'Reach top 3 on the leaderboard', icon: '👑', isUnlocked: false, tier: 'gold' },
  { id: 'zero-waste', name: 'Zero Waste Day', description: 'Log a day with zero carbon emissions', icon: '✨', isUnlocked: false, tier: 'silver' },
  { id: 'century', name: 'Century Club', description: 'Earn 100 eco points', icon: '💯', isUnlocked: false, tier: 'bronze' },
  { id: 'tree-planter', name: 'Tree Planter', description: 'Offset 100kg of CO₂', icon: '🌳', isUnlocked: false, tier: 'platinum' },
];

/* ============================
   Demo / Seed Data
   ============================ */
export function generateDemoEntries(): FootprintEntry[] {
  const entries: FootprintEntry[] = [];
  const now = new Date();

  for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().slice(0, 10);

    const numEntries = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numEntries; j++) {
      const activity = ACTIVITY_CATALOG[Math.floor(Math.random() * ACTIVITY_CATALOG.length)];
      const quantity = Math.round((Math.random() * 20 + 1) * 10) / 10;
      entries.push({
        id: `demo-${daysAgo}-${j}`,
        userId: 'demo-user',
        date: dateStr,
        category: activity.category,
        activity: activity.activity,
        quantity,
        unit: activity.unit,
        carbonKg: Math.round(quantity * activity.carbonPerUnit * 100) / 100,
        createdAt: date.toISOString(),
      });
    }
  }

  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function generateDemoSummaries(): DailySummary[] {
  const entries = generateDemoEntries();
  const grouped: Record<string, FootprintEntry[]> = {};

  entries.forEach(e => {
    const key = e.date.slice(0, 10);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .map(date => {
      const dayEntries = grouped[date];
      const total = dayEntries.reduce((s, e) => s + e.carbonKg, 0);
      return {
        date,
        totalCarbonKg: Math.round(total * 100) / 100,
        entries: dayEntries,
        comparisonToAverage: Math.round((Math.random() * 60 - 30) * 10) / 10,
      };
    });
}

export function generateDemoStreak(): Streak {
  return {
    userId: 'demo-user',
    currentStreak: 12,
    longestStreak: 28,
    lastLogDate: new Date().toISOString(),
    totalPoints: 480,
    level: 5,
    badges: BADGE_DEFINITIONS.map((b, i) => ({
      ...b,
      isUnlocked: i < 4,
      unlockedAt: i < 4 ? new Date(Date.now() - i * 86400000 * 3).toISOString() : undefined,
    })),
  };
}

export function generateDemoLeaderboard(): CommunityMember[] {
  const names = [
    'Arjun S.', 'Priya M.', 'Demo User', 'Kavya R.', 'Ravi K.',
    'Ananya G.', 'Vikram P.', 'Meera T.', 'Sanjay D.', 'Nisha L.',
  ];
  return names.map((name, i) => ({
    userId: i === 2 ? 'demo-user' : `user-${i}`,
    displayName: name,
    currentStreak: Math.max(1, 30 - i * 3 + Math.floor(Math.random() * 5)),
    totalPoints: Math.max(50, 600 - i * 50 + Math.floor(Math.random() * 40)),
    level: Math.max(1, 6 - Math.floor(i / 2)),
    rank: i + 1,
  }));
}

export function generateDemoChallenges(): NeighborhoodChallenge[] {
  const now = new Date();
  return [
    {
      id: 'chal-1',
      title: 'Green Commute Week',
      description: 'Use public transit, bike, or walk for all commutes this week. Zero car emissions!',
      targetCarbonReduction: 50,
      currentProgress: 34,
      participants: 23,
      startDate: new Date(now.getTime() - 3 * 86400000).toISOString(),
      endDate: new Date(now.getTime() + 4 * 86400000).toISOString(),
      isActive: true,
    },
    {
      id: 'chal-2',
      title: 'Meatless Monday Challenge',
      description: 'Go vegetarian or vegan every Monday for a month. Track your meals!',
      targetCarbonReduction: 100,
      currentProgress: 67,
      participants: 41,
      startDate: new Date(now.getTime() - 14 * 86400000).toISOString(),
      endDate: new Date(now.getTime() + 16 * 86400000).toISOString(),
      isActive: true,
    },
    {
      id: 'chal-3',
      title: 'Energy Saver Sprint',
      description: 'Reduce household electricity usage by 20% this month.',
      targetCarbonReduction: 75,
      currentProgress: 75,
      participants: 15,
      startDate: new Date(now.getTime() - 30 * 86400000).toISOString(),
      endDate: new Date(now.getTime() - 1 * 86400000).toISOString(),
      isActive: false,
    },
  ];
}
