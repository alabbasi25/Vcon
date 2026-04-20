import { 
  PlanetHealth, 
  Task, 
  WorshipSession, 
  Transaction, 
  VitalSigns, 
  UserID,
  InventoryItem,
  Liability,
  Challenge,
  RomancePrompt,
  Book,
  HydrationLog
} from './types';

export const calculatePlanetHealth = (
  tasks: Task[],
  inventory: InventoryItem[],
  transactions: Transaction[],
  liabilities: Liability[],
  worship: WorshipSession[],
  vitals: Record<UserID, VitalSigns>,
  challenges: Challenge[],
  romancePrompts: RomancePrompt[],
  library: Book[],
  hydrationLogs: HydrationLog[]
): PlanetHealth => {
  // 1. Logistics Score (25%) - Tasks and Inventory
  const taskCompletion = tasks.length > 0 
    ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
    : 100;
  
  // Checking inventory based on stock levels vs min levels
  const inventoryHealth = inventory.length > 0
    ? (inventory.filter(i => i.currentStock >= i.minStock).length / inventory.length) * 100
    : 100;
  
  const challengeScore = challenges.length > 0
    ? (challenges.filter(c => c.status === 'completed').length / challenges.length) * 100
    : 100;
  const logisticsScore = (taskCompletion + inventoryHealth + challengeScore) / 3;

  // 2. Finance Score (25%) - Transactions vs Budget
  // Simple heuristic: if we have more high-priority transactions than confirmed budget might be low.
  // We'll calculate based on liability coverage and savings progress.
  const liabilityScore = liabilities.length > 0
    ? (liabilities.reduce((acc, l) => acc + (1 - l.remainingAmount / l.totalAmount), 0) / liabilities.length) * 100
    : 100;
  
  const financeScore = Math.round(liabilityScore); // Using liabilities as a proxy for financial health for now

  // 3. Spiritual/Bond Score (25%)
  const worshipScore = worship.length > 0
    ? (worship.reduce((acc, s) => acc + (s.progress / s.target), 0) / worship.length) * 100
    : 100;
  const romanceScore = romancePrompts.length > 0
    ? (romancePrompts.filter(p => p.revealed).length / romancePrompts.length) * 100
    : 100;
  const libraryScore = library.length > 0
    ? (library.reduce((acc, b) => acc + ((b.progress.F + b.progress.B) / (b.totalPages * 2)), 0) / library.length) * 100
    : 100;
  const spiritualScore = (worshipScore + romanceScore + libraryScore) / 3;

  // 4. Health Score (25%) - Sleep, Steps, and Hydration
  const avgSleep = (vitals.F.sleepQuality + vitals.B.sleepQuality) / 2;
  const stepTarget = 10000;
  const stepScore = Math.min(100, ((vitals.F.steps + vitals.B.steps) / (stepTarget * 2)) * 100);
  
  // Hydration: 2000ml target per person
  const hydrationTarget = 4000; // Total for both
  const today = new Date().setHours(0,0,0,0);
  const todaysHydration = hydrationLogs
    .filter(l => l.timestamp >= today)
    .reduce((acc, l) => acc + l.amount, 0);
  const hydrationScore = Math.min(100, (todaysHydration / hydrationTarget) * 100);
  
  const healthScore = (avgSleep + stepScore + hydrationScore) / 3;

  // Weighted Total
  const totalScore = Math.round(
    (logisticsScore * 0.25) +
    (financeScore * 0.25) +
    (spiritualScore * 0.25) +
    (healthScore * 0.25)
  );

  return {
    score: totalScore,
    breakdown: {
      logistics: Math.round(logisticsScore),
      finance: Math.round(financeScore),
      spiritual: Math.round(spiritualScore),
      health: Math.round(healthScore)
    }
  };
};
