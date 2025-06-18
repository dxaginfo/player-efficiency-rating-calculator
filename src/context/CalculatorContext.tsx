import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  CalculatorContextState, 
  CalculatorAction, 
  PlayerStats, 
  PerResult 
} from '../types';
import { 
  DEFAULT_LEAGUE_AVERAGES, 
  DEFAULT_PER_WEIGHTS, 
  calculatePER 
} from '../utils/perCalculations';

// Initial state for the calculator context
const initialState: CalculatorContextState = {
  playerStats: null,
  perResult: null,
  comparisonPlayers: [],
  leagueAverages: DEFAULT_LEAGUE_AVERAGES,
  customWeights: DEFAULT_PER_WEIGHTS,
  isUsingCustomWeights: false,
  isCalculating: false,
  error: null,
};

// Reducer function to handle state updates
function calculatorReducer(
  state: CalculatorContextState,
  action: CalculatorAction
): CalculatorContextState {
  switch (action.type) {
    case 'SET_PLAYER_STATS':
      return {
        ...state,
        playerStats: action.payload,
        error: null,
      };
    
    case 'SET_PER_RESULT':
      return {
        ...state,
        perResult: action.payload,
        error: null,
      };
    
    case 'ADD_COMPARISON_PLAYER':
      // Prevent adding duplicate players
      if (state.comparisonPlayers.some(player => player.playerId === action.payload.playerId)) {
        return state;
      }
      return {
        ...state,
        comparisonPlayers: [...state.comparisonPlayers, action.payload],
      };
    
    case 'REMOVE_COMPARISON_PLAYER':
      return {
        ...state,
        comparisonPlayers: state.comparisonPlayers.filter(
          player => player.playerId !== action.payload
        ),
      };
    
    case 'SET_LEAGUE_AVERAGES':
      return {
        ...state,
        leagueAverages: action.payload,
      };
    
    case 'SET_CUSTOM_WEIGHTS':
      return {
        ...state,
        customWeights: action.payload,
      };
    
    case 'TOGGLE_CUSTOM_WEIGHTS':
      return {
        ...state,
        isUsingCustomWeights: action.payload,
      };
    
    case 'SET_CALCULATING':
      return {
        ...state,
        isCalculating: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'RESET_CALCULATOR':
      return {
        ...initialState,
        // Preserve league averages and custom weights when resetting
        leagueAverages: state.leagueAverages,
        customWeights: state.customWeights,
        isUsingCustomWeights: state.isUsingCustomWeights,
      };
    
    default:
      return state;
  }
}

// Create the context
export const CalculatorContext = createContext<{
  state: CalculatorContextState;
  dispatch: React.Dispatch<CalculatorAction>;
  calculatePlayerPER: (stats: PlayerStats) => Promise<void>;
  addComparisonPlayer: (stats: PlayerStats) => Promise<void>;
  removeComparisonPlayer: (playerId: string) => void;
  resetCalculator: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  calculatePlayerPER: async () => {},
  addComparisonPlayer: async () => {},
  removeComparisonPlayer: () => {},
  resetCalculator: () => {},
});

// Context provider component
export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Calculate PER for a player
  const calculatePlayerPER = async (stats: PlayerStats) => {
    try {
      dispatch({ type: 'SET_CALCULATING', payload: true });
      dispatch({ type: 'SET_PLAYER_STATS', payload: stats });
      
      // Simulate an API call or computation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const weights = state.isUsingCustomWeights ? state.customWeights : DEFAULT_PER_WEIGHTS;
      const perResult = calculatePER(stats, state.leagueAverages, weights);
      
      dispatch({ type: 'SET_PER_RESULT', payload: perResult });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  };

  // Add a player to the comparison list
  const addComparisonPlayer = async (stats: PlayerStats) => {
    try {
      // Simulate an API call or computation delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const weights = state.isUsingCustomWeights ? state.customWeights : DEFAULT_PER_WEIGHTS;
      const perResult = calculatePER(stats, state.leagueAverages, weights);
      
      dispatch({ type: 'ADD_COMPARISON_PLAYER', payload: perResult });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  };

  // Remove a player from the comparison list
  const removeComparisonPlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_COMPARISON_PLAYER', payload: playerId });
  };

  // Reset the calculator
  const resetCalculator = () => {
    dispatch({ type: 'RESET_CALCULATOR' });
  };

  return (
    <CalculatorContext.Provider
      value={{
        state,
        dispatch,
        calculatePlayerPER,
        addComparisonPlayer,
        removeComparisonPlayer,
        resetCalculator,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

// Custom hook for using the calculator context
export const useCalculator = () => useContext(CalculatorContext);