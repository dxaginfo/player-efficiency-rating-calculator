import { 
  PlayerStats, 
  PerResult, 
  PerComponents, 
  PerRating, 
  LeagueAverages, 
  PerWeights 
} from '../types';

// Default league averages for the 2024-2025 NBA season
// These values would ideally come from a real API or database
export const DEFAULT_LEAGUE_AVERAGES: LeagueAverages = {
  pace: 98.1, // League average pace
  averageUnadjustedPer: 15.0, // By definition
};

// Default weights for the PER formula
export const DEFAULT_PER_WEIGHTS: PerWeights = {
  fieldGoalWeight: 2.0,
  threePointerWeight: 3.0,
  freeThrowWeight: 0.67,
  offensiveReboundWeight: 0.7,
  defensiveReboundWeight: 0.3,
  assistWeight: 0.7,
  stealWeight: 1.0,
  blockWeight: 0.7,
  turnoverWeight: -1.0,
  missedFieldGoalWeight: -0.4,
  missedFreeThrowWeight: -0.8,
  personalFoulWeight: -0.4,
};

/**
 * Calculates the Player Efficiency Rating (PER) based on provided stats
 * 
 * @param stats - The player's statistics
 * @param leagueAverages - League-wide statistics for normalization
 * @param weights - Optional custom weights for the PER formula
 * @returns A PerResult object containing the calculated PER and components
 */
export function calculatePER(
  stats: PlayerStats, 
  leagueAverages: LeagueAverages = DEFAULT_LEAGUE_AVERAGES,
  weights: PerWeights = DEFAULT_PER_WEIGHTS
): PerResult {
  // Calculate minutes per game
  const minutesPerGame = stats.minutesPlayed / stats.gamesPlayed;
  
  if (minutesPerGame === 0) {
    throw new Error("Minutes played must be greater than zero");
  }

  // Calculate the raw components for the unadjusted PER
  const twoPointersMade = stats.fieldGoalsMade - stats.threePointersMade;
  const twoPointersAttempted = stats.fieldGoalsAttempted - stats.threePointersAttempted;
  
  // Calculate positive contributions
  const scoringValue = 
    weights.threePointerWeight * stats.threePointersMade +
    weights.fieldGoalWeight * twoPointersMade +
    weights.freeThrowWeight * stats.freeThrowsMade;
  
  const reboundingValue = 
    weights.offensiveReboundWeight * stats.offensiveRebounds +
    weights.defensiveReboundWeight * stats.defensiveRebounds;
  
  const assistValue = weights.assistWeight * stats.assists;
  
  const defensiveValue = 
    weights.stealWeight * stats.steals +
    weights.blockWeight * stats.blocks;
  
  // Calculate negative contributions
  const missedShotsValue = 
    weights.missedFieldGoalWeight * (stats.fieldGoalsAttempted - stats.fieldGoalsMade) +
    weights.missedFreeThrowWeight * (stats.freeThrowsAttempted - stats.freeThrowsMade);
  
  const turnoverValue = weights.turnoverWeight * stats.turnovers;
  
  const foulValue = weights.personalFoulWeight * stats.personalFouls;
  
  const negativeValue = missedShotsValue + turnoverValue + foulValue;
  
  // Calculate unadjusted PER (per minute)
  const perPerMinute = (scoringValue + reboundingValue + assistValue + defensiveValue + negativeValue) / stats.minutesPlayed;
  
  // Scale to per-36-minutes basis (traditional PER is presented this way)
  const rawPer = perPerMinute * 36;
  
  // Apply league adjustments
  const paceAdjustment = leagueAverages.pace / 100;
  const leagueAdjustment = 15 / leagueAverages.averageUnadjustedPer;
  
  const adjustedPer = rawPer * paceAdjustment * leagueAdjustment;
  
  // Create component breakdown for visualization
  const components: PerComponents = {
    scoringContribution: scoringValue / stats.minutesPlayed * 36,
    reboundingContribution: reboundingValue / stats.minutesPlayed * 36,
    assistContribution: assistValue / stats.minutesPlayed * 36,
    defensiveContribution: defensiveValue / stats.minutesPlayed * 36,
    negativeContribution: negativeValue / stats.minutesPlayed * 36,
  };
  
  return {
    playerId: stats.playerId,
    playerName: stats.playerName,
    rawPer,
    adjustedPer,
    components,
    rating: getRatingFromPER(adjustedPer),
  };
}

/**
 * Determines the qualitative rating based on the PER value
 * 
 * @param per - The calculated Player Efficiency Rating
 * @returns A string rating category
 */
export function getRatingFromPER(per: number): PerRating {
  if (per >= 30) return 'All-time great';
  if (per >= 25) return 'MVP candidate';
  if (per >= 20) return 'All-Star';
  if (per >= 15) return 'Starter';
  if (per >= 13) return 'Rotation player';
  return 'Bench player';
}

/**
 * Generates sample player data for demo purposes
 * 
 * @returns A PlayerStats object with sample data
 */
export function generateSamplePlayerStats(): PlayerStats {
  return {
    playerName: "LeBron James",
    team: "Los Angeles Lakers",
    position: "SF",
    season: "2024-2025",
    gamesPlayed: 65,
    minutesPlayed: 2132,
    fieldGoalsMade: 621,
    fieldGoalsAttempted: 1208,
    threePointersMade: 132,
    threePointersAttempted: 369,
    freeThrowsMade: 325,
    freeThrowsAttempted: 418,
    offensiveRebounds: 58,
    defensiveRebounds: 467,
    assists: 559,
    steals: 87,
    blocks: 53,
    turnovers: 219,
    personalFouls: 112,
  };
}

/**
 * Generates sample comparison players for demo purposes
 * 
 * @returns An array of PlayerStats objects with sample data
 */
export function generateComparisonPlayers(): PlayerStats[] {
  return [
    {
      playerId: "1",
      playerName: "Nikola Jokić",
      team: "Denver Nuggets",
      position: "C",
      season: "2024-2025",
      gamesPlayed: 72,
      minutesPlayed: 2462,
      fieldGoalsMade: 689,
      fieldGoalsAttempted: 1195,
      threePointersMade: 87,
      threePointersAttempted: 238,
      freeThrowsMade: 421,
      freeThrowsAttempted: 482,
      offensiveRebounds: 195,
      defensiveRebounds: 672,
      assists: 624,
      steals: 101,
      blocks: 62,
      turnovers: 247,
      personalFouls: 193,
    },
    {
      playerId: "2",
      playerName: "Stephen Curry",
      team: "Golden State Warriors",
      position: "PG",
      season: "2024-2025",
      gamesPlayed: 68,
      minutesPlayed: 2185,
      fieldGoalsMade: 562,
      fieldGoalsAttempted: 1185,
      threePointersMade: 317,
      threePointersAttempted: 724,
      freeThrowsMade: 286,
      freeThrowsAttempted: 308,
      offensiveRebounds: 42,
      defensiveRebounds: 306,
      assists: 392,
      steals: 95,
      blocks: 18,
      turnovers: 178,
      personalFouls: 142,
    },
    {
      playerId: "3",
      playerName: "Giannis Antetokounmpo",
      team: "Milwaukee Bucks",
      position: "PF",
      season: "2024-2025",
      gamesPlayed: 70,
      minutesPlayed: 2310,
      fieldGoalsMade: 721,
      fieldGoalsAttempted: 1215,
      threePointersMade: 32,
      threePointersAttempted: 118,
      freeThrowsMade: 487,
      freeThrowsAttempted: 731,
      offensiveRebounds: 158,
      defensiveRebounds: 632,
      assists: 385,
      steals: 89,
      blocks: 93,
      turnovers: 227,
      personalFouls: 203,
    },
  ];
}