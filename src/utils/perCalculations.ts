/**
 * Player Efficiency Rating (PER) calculation utilities
 */

interface PlayerStats {
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
  points: number;           // Total points (for validation)
  
  // League context (optional, defaults provided)
  leagueAveragePace?: number;  // League average pace factor
  leagueAverageUPER?: number;  // League average unadjusted PER
}

/**
 * Calculate the unadjusted Player Efficiency Rating (uPER) based on raw statistics
 * 
 * @param stats Player statistics
 * @returns Unadjusted PER value
 */
export const calculateUnadjustedPER = (stats: PlayerStats): number => {
  const {
    minutes,
    fieldGoalsMade,
    fieldGoalsAttempted,
    threesMade,
    threesAttempted,
    freeThrowsMade,
    freeThrowsAttempted,
    offensiveRebounds,
    defensiveRebounds,
    assists,
    steals,
    blocks,
    turnovers,
    personalFouls
  } = stats;
  
  // Calculate two-pointers (non-three-point field goals)
  const twoPointsMade = fieldGoalsMade - threesMade;
  
  // Check if minutes played is valid to avoid division by zero
  if (minutes <= 0) {
    throw new Error('Minutes played must be greater than zero');
  }
  
  // Calculate unadjusted PER (uPER) using Hollinger's formula
  const uPER = (1 / minutes) * (
    // Positive contributions
    (threesMade * 3) +             // Three-pointers (3 points each)
    (twoPointsMade * 2) +          // Two-pointers (2 points each)
    (freeThrowsMade * (2/3)) +     // Free throws (weighted)
    (offensiveRebounds * 0.7) +    // Offensive rebounds (weighted)
    (defensiveRebounds * 0.3) +    // Defensive rebounds (weighted)
    steals +                       // Steals
    (assists * 0.7) +              // Assists (weighted)
    (blocks * 0.7) -               // Blocks (weighted)
    
    // Negative contributions
    (freeThrowsAttempted * 0.8) -              // Free throw attempts (missed opportunities)
    (fieldGoalsAttempted - fieldGoalsMade) * 0.4 -  // Missed field goals
    (threesAttempted - threesMade) * 0.4 -     // Missed three-pointers
    turnovers -                               // Turnovers
    (personalFouls * 0.4)                     // Personal fouls
  );
  
  return uPER;
};

/**
 * Calculate the adjusted Player Efficiency Rating (PER)
 * normalized to league average of 15
 * 
 * @param uPER Unadjusted PER value
 * @param leagueAveragePace League average pace factor (default: 1.0)
 * @param leagueAverageUPER League average unadjusted PER (default: 15.0)
 * @returns Adjusted PER value
 */
export const calculateAdjustedPER = (
  uPER: number,
  leagueAveragePace: number = 1.0,
  leagueAverageUPER: number = 15.0
): number => {
  // Adjust for pace factor and normalize to league average of 15
  const adjustmentFactor = (15 / leagueAverageUPER) * leagueAveragePace;
  return uPER * adjustmentFactor;
};

/**
 * Get PER rating category based on the calculated PER value
 * 
 * @param per Player Efficiency Rating value
 * @returns Rating category description
 */
export const getPERCategory = (per: number): string => {
  if (per >= 30) return 'All-time great season';
  if (per >= 25) return 'MVP candidate';
  if (per >= 20) return 'All-Star caliber';
  if (per >= 15) return 'Solid starter';
  if (per >= 13) return 'Rotation player';
  return 'Bench player';
};

/**
 * Validate player statistics for internal consistency
 * 
 * @param stats Player statistics to validate
 * @returns Object with validation result and error message
 */
export const validatePlayerStats = (stats: PlayerStats): { valid: boolean; error?: string } => {
  const {
    minutes,
    fieldGoalsMade,
    fieldGoalsAttempted,
    threesMade,
    threesAttempted,
    freeThrowsMade,
    freeThrowsAttempted,
    points
  } = stats;
  
  // Check for negative values
  const allStats = Object.entries(stats);
  for (const [key, value] of allStats) {
    if (typeof value === 'number' && value < 0) {
      return { valid: false, error: `${key} cannot be negative` };
    }
  }
  
  // Check for logical constraints
  if (minutes <= 0) {
    return { valid: false, error: 'Minutes played must be greater than zero' };
  }
  
  if (fieldGoalsMade > fieldGoalsAttempted) {
    return { valid: false, error: 'Field goals made cannot exceed attempted' };
  }
  
  if (threesMade > threesAttempted) {
    return { valid: false, error: 'Three-pointers made cannot exceed attempted' };
  }
  
  if (threesMade > fieldGoalsMade) {
    return { valid: false, error: 'Three-pointers made cannot exceed total field goals made' };
  }
  
  if (freeThrowsMade > freeThrowsAttempted) {
    return { valid: false, error: 'Free throws made cannot exceed attempted' };
  }
  
  // Verify points total if provided
  const calculatedPoints = (fieldGoalsMade - threesMade) * 2 + threesMade * 3 + freeThrowsMade;
  if (points && calculatedPoints !== points) {
    return { 
      valid: false, 
      error: `Points total (${points}) doesn't match calculated value (${calculatedPoints})` 
    };
  }
  
  return { valid: true };
};

/**
 * Calculate full PER with validation
 * 
 * @param stats Player statistics
 * @returns Object with PER value, category, and component breakdown
 */
export const calculatePER = (stats: PlayerStats): {
  valid: boolean;
  error?: string;
  per?: number;
  category?: string;
  components?: Record<string, number>;
} => {
  // Validate stats first
  const validation = validatePlayerStats(stats);
  if (!validation.valid) {
    return validation;
  }
  
  try {
    // Calculate unadjusted PER
    const uPER = calculateUnadjustedPER(stats);
    
    // Calculate adjusted PER
    const per = calculateAdjustedPER(
      uPER, 
      stats.leagueAveragePace, 
      stats.leagueAverageUPER
    );
    
    // Get rating category
    const category = getPERCategory(per);
    
    // Calculate component breakdown for visualization
    const components = {
      scoring: ((stats.fieldGoalsMade - stats.threesMade) * 2 + stats.threesMade * 3 + stats.freeThrowsMade * (2/3)) / stats.minutes,
      rebounding: (stats.offensiveRebounds * 0.7 + stats.defensiveRebounds * 0.3) / stats.minutes,
      playmaking: (stats.assists * 0.7) / stats.minutes,
      defense: (stats.steals + stats.blocks * 0.7) / stats.minutes,
      negatives: -(stats.freeThrowsAttempted * 0.8 - stats.freeThrowsMade * (2/3) + 
                  (stats.fieldGoalsAttempted - stats.fieldGoalsMade) * 0.4 + 
                  stats.turnovers + 
                  stats.personalFouls * 0.4) / stats.minutes
    };
    
    return {
      valid: true,
      per,
      category,
      components
    };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error calculating PER' 
    };
  }
};