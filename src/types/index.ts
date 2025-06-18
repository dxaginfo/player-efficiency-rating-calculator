// Type definitions for the PER Calculator application

// Player statistics input interface
export interface PlayerStats {
  // Player identification
  playerId?: string;
  playerName: string;
  team?: string;
  position?: string;
  season?: string;
  
  // Game statistics
  gamesPlayed: number;
  minutesPlayed: number;
  
  // Scoring
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  
  // Rebounding
  offensiveRebounds: number;
  defensiveRebounds: number;
  
  // Other stats
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
}

// Interface for PER calculation results
export interface PerResult {
  playerId?: string;
  playerName: string;
  rawPer: number;
  adjustedPer: number;
  components: PerComponents;
  rating: PerRating;
}

// Breakdown of PER components for visualization
export interface PerComponents {
  scoringContribution: number;
  reboundingContribution: number;
  assistContribution: number;
  defensiveContribution: number;
  negativeContribution: number;
}

// Categorical rating based on PER value
export type PerRating = 
  | 'All-time great' 
  | 'MVP candidate' 
  | 'All-Star' 
  | 'Starter' 
  | 'Rotation player'
  | 'Bench player';

// League averages for PER normalization
export interface LeagueAverages {
  pace: number;
  averageUnadjustedPer: number;
  // Could include more league-wide stats for advanced calculations
}

// Custom PER formula weights for advanced users
export interface PerWeights {
  fieldGoalWeight: number;
  threePointerWeight: number;
  freeThrowWeight: number;
  offensiveReboundWeight: number;
  defensiveReboundWeight: number;
  assistWeight: number;
  stealWeight: number;
  blockWeight: number;
  turnoverWeight: number;
  missedFieldGoalWeight: number;
  missedFreeThrowWeight: number;
  personalFoulWeight: number;
}

// Interface for the calculator context
export interface CalculatorContextState {
  playerStats: PlayerStats | null;
  perResult: PerResult | null;
  comparisonPlayers: PerResult[];
  leagueAverages: LeagueAverages;
  customWeights: PerWeights;
  isUsingCustomWeights: boolean;
  isCalculating: boolean;
  error: string | null;
}

// Actions for the calculator context reducer
export type CalculatorAction =
  | { type: 'SET_PLAYER_STATS'; payload: PlayerStats }
  | { type: 'SET_PER_RESULT'; payload: PerResult }
  | { type: 'ADD_COMPARISON_PLAYER'; payload: PerResult }
  | { type: 'REMOVE_COMPARISON_PLAYER'; payload: string }  // playerId
  | { type: 'SET_LEAGUE_AVERAGES'; payload: LeagueAverages }
  | { type: 'SET_CUSTOM_WEIGHTS'; payload: PerWeights }
  | { type: 'TOGGLE_CUSTOM_WEIGHTS'; payload: boolean }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CALCULATOR' };