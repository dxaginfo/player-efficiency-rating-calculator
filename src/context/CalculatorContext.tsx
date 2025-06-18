import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlayerStats, PERResult, PlayerProfile } from '../types';
import { calculatePER } from '../utils/perCalculations';

interface CalculatorContextType {
  currentPlayerStats: PlayerStats | null;
  calculationResult: PERResult | null;
  savedPlayers: PlayerProfile[];
  calculatePlayerPER: (stats: PlayerStats) => void;
  savePERCalculation: () => void;
  removeSavedPlayer: (index: number) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

interface CalculatorProviderProps {
  children: ReactNode;
}

export const CalculatorProvider: React.FC<CalculatorProviderProps> = ({ children }) => {
  const [currentPlayerStats, setCurrentPlayerStats] = useState<PlayerStats | null>(null);
  const [calculationResult, setCalculationResult] = useState<PERResult | null>(null);
  const [savedPlayers, setSavedPlayers] = useState<PlayerProfile[]>([]);

  const calculatePlayerPER = (stats: PlayerStats) => {
    setCurrentPlayerStats(stats);
    const result = calculatePER(stats);
    setCalculationResult(result);
  };

  const savePERCalculation = () => {
    if (currentPlayerStats && calculationResult && calculationResult.valid) {
      const playerProfile: PlayerProfile = {
        ...currentPlayerStats,
        perResult: calculationResult
      };
      
      setSavedPlayers(prev => [...prev, playerProfile]);
    }
  };

  const removeSavedPlayer = (index: number) => {
    setSavedPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const value: CalculatorContextType = {
    currentPlayerStats,
    calculationResult,
    savedPlayers,
    calculatePlayerPER,
    savePERCalculation,
    removeSavedPlayer
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export default CalculatorContext;