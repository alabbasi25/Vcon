export type UserID = 'F' | 'B'; // F: Fahad, B: Bushra

export interface UserStatus {
  userId: UserID;
  status: 'online' | 'offline' | 'busy';
  mood?: string;
  workMode: boolean;
  lastActive: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  grantedTo: UserID[];
  category: 'finance' | 'logistics' | 'privacy' | 'future';
}

export interface ConsensusRequest {
  id: string;
  type: 'transaction' | 'event' | 'goal';
  requestedBy: UserID;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: UserID;
  status: 'pending' | 'completed' | 'syncing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'home' | 'work' | 'personal' | 'other';
  estimatedMinutes: number;
  createdAt: number;
  dueDate?: number;
  delegation?: {
    from: UserID;
    reason: string;
    timestamp: number;
  };
}

export type PlanetWeatherStatus = 'sunny' | 'cloudy' | 'stormy';

export interface PlanetWeather {
  status: PlanetWeatherStatus;
  reason: string;
  suggestion: string;
  timestamp: number;
}

export interface VisionBoardGoal extends AssetGoal {
  visualDescription: string;
  imageUrl?: string;
  isApprovedByF: boolean;
  isApprovedByB: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  category: string;
  lastRestocked: number;
  status: 'ok' | 'low';
}

export interface KanbanItem extends InventoryItem {
  kanbanStatus: 'needed' | 'in-cart' | 'purchased';
  consumptionFrequencyDays?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'fixed' | 'variable';
  category: string;
  description: string;
  timestamp: number;
  status: 'confirmed' | 'pending';
  requiresConsensus?: boolean;
}

export interface AssetGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  requiresDualAuth: boolean;
  isLocked: boolean;
  unlockRequests: UserID[]; // Both must be present to unlock
  withdrawRequests?: {
    amount: number;
    requestedBy: UserID;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  category: string;
  participants: UserID[];
  location?: string;
  status: 'confirmed' | 'pending';
}

export interface WorshipSession {
  id: string;
  type: 'tasbeeh' | 'quran' | 'dua';
  participants: UserID[];
  progress: number;
  target: number;
  isLive: boolean;
  syncCounter?: Record<UserID, number>; // Real-time tasbeeh sync
  quranSync?: Record<UserID, number>;
}

export interface VitalSigns {
  userId: UserID;
  weight: number;
  sleepQuality: number;
  steps: number;
  calories: number;
  googleFitConnected: boolean;
  lastSync: number;
}

export interface Notification {
  id: string;
  type: 'urgent' | 'routine' | 'financial' | 'spiritual' | 'social' | 'tasks';
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface TravelPlan {
  id: string;
  destination: string;
  startDate: number;
  endDate: number;
  budget: number;
  tickets: string[];
  packingList: { item: string; packed: boolean }[];
}

export interface ChildMilestone {
  id: string;
  childId: 'E' | 'W' | 'A';
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: number;
  reactions: { userId: UserID, type: string }[];
}

export interface FutureFamily {
  names: string[];
  educationSavings: number;
  notes: string;
  vision: string;
  childrenReports: ChildReport[];
  milestones: ChildMilestone[];
}

export interface ChildReport {
  id: string;
  childName: string;
  subject: string;
  status: 'excellent' | 'good' | 'needs_improvement';
  notes: string;
  lastUpdated: number;
}

export interface PrivateNote {
  id: string;
  content: string;
  timestamp: number;
}

export interface GratitudePost {
  id: string;
  authorId: UserID;
  content: string;
  timestamp: number;
  reactions: string[]; // Emojis
  likes: UserID[];
  comments: { id: string; userId: UserID; text: string; timestamp: number }[];
}

export interface ConflictMessage {
  id: string;
  authorId: UserID;
  content: string;
  timestamp: number;
  revealed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  color: 'blue' | 'emerald' | 'purple';
  lastUpdated: number;
}

export interface NotificationSettings {
  tasks: boolean;
  updates: boolean;
  athkar: boolean;
  financial: boolean;
  social: boolean;
}

export interface TaskSettings {
  showDailyFilter: boolean;
}

export interface UserProfile {
  userId: UserID;
  name: string;
  avatar?: string;
  bio?: string;
  joinedAt: number;
  delegatedSpendingCeiling: number; // Max amount without partner approval
  notificationSettings: NotificationSettings;
  taskSettings: TaskSettings;
}

export interface Streak {
  userId: UserID;
  count: number;
  lastCompletedAt?: number;
}

export interface HobbyProject {
  id: string;
  userId: UserID;
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  dailyPhotos: { url: string, timestamp: number }[];
  reactions: { userId: UserID, type: string }[];
}

export interface TimeCapsuleMessage {
  id: string;
  authorId: UserID;
  content: string;
  targetDate: number;
  isUnlocked: boolean;
  timestamp: number;
}

export interface DeadManSwitch {
  lastCheck: number;
  nextCheck: number;
  status: 'active' | 'triggered';
}

export interface FitnessBattle {
  F: { steps: number; calories: number };
  B: { steps: number; calories: number };
}

export interface Budget {
  monthlyLimit: number;
  categories: { name: string; allocated: number; spent: number }[];
  lastReset: number;
}

export interface MoodEntry {
  id: string;
  userId: UserID;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired' | 'stressed' | 'loving';
  note?: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  images: string[];
  authorId: UserID;
  timestamp: number;
}

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'time' | 'touch';

export interface LoveLanguageResult {
  userId: UserID;
  scores: Record<LoveLanguage, number>;
  primary: LoveLanguage;
}

export interface AthkarItem {
  id: string;
  text: string;
  category: 'morning' | 'evening' | 'custom';
  target: number;
  count: Record<UserID, number>;
  isDaily: boolean;
  notificationTime?: string; // HH:mm
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  lastCompleted?: Record<UserID, number>;
}

export interface ChatMessage {
  id: string;
  senderId: UserID;
  text: string;
  timestamp: number;
  type: 'text' | 'audio' | 'image' | 'video' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyToId?: string;
  editedAt?: number;
  reactions: Record<string, UserID[]>; // emoji -> userIds
  audioUrl?: string;
  isForwarded?: boolean;
  fileData?: {
    name: string;
    size: number;
    url: string;
  };
}

export interface KokabState {
  currentUser: UserID;
  partnerStatus: UserStatus | null;
  planetHealth: PlanetHealth;
  weather: PlanetWeather;
  emergencyMode: boolean;
  smartHydrationEnabled: boolean;
  barakahPoints: number;
  permissions: Permission[];
  consensusRequests: ConsensusRequest[];
  arbitrationRequests: ArbitrationRequest[];
  deadManSwitch: DeadManSwitch;
  fitnessBattle: FitnessBattle;
  budget: Budget;
  athkar: AthkarItem[];
  messages: ChatMessage[];
  isPartnerTyping: boolean;
  
  // Layer 1
  calendar: CalendarEvent[];
  tasks: Task[];
  inventory: KanbanItem[];
  transactions: Transaction[];
  liabilities: Liability[];
  assets: VisionBoardGoal[];
  
  // Layer 2
  privateNotes: PrivateNote[];
  vitals: Record<UserID, VitalSigns>;
  habits: Record<UserID, Habit[]>;
  moodLogs: MoodEntry[];
  journal: JournalEntry[];
  
  // Layer 3
  worship: WorshipSession[];
  gratitudeFeed: GratitudePost[];
  conflictRoom: ConflictMessage[];
  vault: SecureDocument[];
  travel: TravelPlan[];
  family: FutureFamily;
  notifications: Notification[];
  challenges: Challenge[];
  romancePrompts: RomancePrompt[];
  library: Book[];
  focusStates: Record<UserID, FocusState>;
  hydrationLogs: HydrationLog[];
  timeCapsules: TimeCapsuleMessage[];
  geoCapsules: GeoTimeCapsule[];
  profiles: Record<UserID, UserProfile>;
  streaks: Record<UserID, Streak>;
  rouletteTasks: string[]; // IDs of tasks in the roulette
  hobbyProjects: HobbyProject[];
  loveLanguages: LoveLanguageResult[];
  coinStaking: CoinStaking;
  quranTracker: QuranTracker;
  moodConfigs: MoodConfig[];
  priorityConfigs: PriorityConfig[];
}

export interface QuranTracker {
  logs: Record<UserID, DailyQuranLog[]>;
  totalVerses: number;
}

export interface DailyQuranLog {
  date: string;
  verses: number;
}

export interface MoodConfig {
  mood: string;
  color: string;
}

export interface PriorityConfig {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  color: string;
}

export interface CoinStaking {
  rewardRate: number;
  amount: number;
  rewards: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  proposer: UserID;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  points: number;
  durationMinutes: number;
  startTime?: number;
  winner?: UserID;
}

export interface RomancePrompt {
  id: string;
  question: string;
  answers: Record<UserID, string>;
  revealed: boolean;
  timestamp: number;
}

export interface MarginaliaComment {
  id: string;
  userId: UserID;
  text: string;
  timestamp: number;
  position: { x: number, y: number };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  progress: Record<UserID, number>; // Page number
  totalPages: number;
  category: string;
  marginalia: MarginaliaComment[];
  audioNotes: AudioNote[];
}

export interface AudioNote {
  id: string;
  userId: UserID;
  timestamp: number;
  duration: number;
  url: string; // Mock URL
  pageNumber: number;
}

export interface FocusState {
  userId: UserID;
  isActive: boolean;
  startTime: number;
  task?: string;
}

export interface HydrationLog {
  userId: UserID;
  amount: number; // ml
  timestamp: number;
}

export interface GeoTimeCapsule {
  id: string;
  authorId: UserID;
  content: string;
  type: 'video' | 'text' | 'audio';
  location: { lat: number, lng: number, name: string };
  isUnlocked: boolean;
  timestamp: number;
}

export interface Liability {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  dueDate: number;
}

export interface SecureDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  addedAt: number;
  expiryDate?: number;
  isTimeCapsule?: boolean;
  unlockDate?: number;
  timedAccess?: {
    grantedTo: UserID[];
    expiresAt: number;
  };
}

export interface PlanetHealth {
  score: number;
  breakdown: {
    logistics: number;
    finance: number;
    spiritual: number;
    health: number;
  };
}

export interface ArbitrationRequest {
  id: string;
  topic: string;
  proposerId: UserID;
  proposerArgument: string;
  partnerArgument?: string;
  status: 'pending_partner' | 'processing_ai' | 'resolved';
  aiSuggestion?: string;
  timestamp: number;
}

export type Theme = 'midnight' | 'emerald' | 'gold' | 'rose' | 'light' | 'high-contrast' | 'system';

export type PrivacyState = 'private' | 'shared' | 'public';

export interface KokabItem {
  id: string;
  title: string;
  content: string;
  category: 'romance' | 'planning' | 'spiritual' | 'daily';
  privacy: PrivacyState;
  isFavorite: boolean;
}
