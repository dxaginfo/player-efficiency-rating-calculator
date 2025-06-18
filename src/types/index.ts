/**
 * TypeScript type definitions for the application
 */

// Player statistics for PER calculation
export interface PlayerStats {
  // Basic information
  playerName: string;
  team?: string;
  season?: string;
  
  // Game statistics
  minutes: number;           // Minutes played
  fieldGoalsMade: number;    // Field goals made
  fieldGoalsAttempted: number; // Field goals attempted
  threesMade: number;       // Three-pointers made
  threesAttempted: number;  // Three-pointers attempted
  freeThrowsMade: number;   // Free throws made
  freeThrowsAttempted: number; // Free throws attempted
  offensiveRebounds: number; // Offensive rebounds
  defensiveRebounds: number; // Defensive rebounds
  assists: number;          // Assists
  steals: number;           // Steals
  blocks: number;           // Blocks
  turnovers: number;        // Turnovers
  personalFouls: number;    // Personal fouls
  points: number;           // Total points (optional, for validation)
  
  // League context (optional, defaults provided)
  leagueAveragePace?: number;  // League average pace factor
  leagueAverageUPER?: number;  // League average unadjusted PER
}

// PER calculation result
export interface PERResult {
  valid: boolean;
  error?: string;
  per?: number;
  category?: string;
  components?: PERComponents;
}

// PER component breakdown
export interface PERComponents {
  scoring: number;
  rebounding: number;
  playmaking: number;
  defense: number;
  negatives: number;
}

// Player profile with PER result
export interface PlayerProfile extends PlayerStats {
  perResult: PERResult;
}