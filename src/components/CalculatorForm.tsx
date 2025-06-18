import React, { useState } from 'react';
import { PlayerStats } from '../types';

interface CalculatorFormProps {
  onCalculate: (stats: PlayerStats) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  // Default values for the form
  const initialStats: PlayerStats = {
    playerName: '',
    team: '',
    season: '',
    minutes: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threesMade: 0,
    threesAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    personalFouls: 0,
    points: 0,
    leagueAveragePace: 1.0,
    leagueAverageUPER: 15.0
  };

  const [stats, setStats] = useState<PlayerStats>(initialStats);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert to number for numerical fields
    const isNumericField = name !== 'playerName' && name !== 'team' && name !== 'season';
    const newValue = isNumericField ? parseFloat(value) || 0 : value;
    
    setStats(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Basic form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!stats.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }
    
    if (stats.minutes <= 0) {
      newErrors.minutes = 'Minutes must be greater than 0';
    }
    
    // Logical constraints
    if (stats.fieldGoalsMade > stats.fieldGoalsAttempted) {
      newErrors.fieldGoalsMade = 'Cannot make more field goals than attempted';
    }
    
    if (stats.threesMade > stats.threesAttempted) {
      newErrors.threesMade = 'Cannot make more three-pointers than attempted';
    }
    
    if (stats.threesMade > stats.fieldGoalsMade) {
      newErrors.threesMade = 'Three-pointers made cannot exceed total field goals made';
    }
    
    if (stats.freeThrowsMade > stats.freeThrowsAttempted) {
      newErrors.freeThrowsMade = 'Cannot make more free throws than attempted';
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // Form is valid if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(stats);
    }
  };

  // Reset form to initial values
  const handleReset = () => {
    setStats(initialStats);
    setErrors({});
  };

  // Sample data for quick testing
  const fillSampleData = () => {
    // LeBron James 2019-20 season (example data)
    setStats({
      playerName: 'LeBron James',
      team: 'Los Angeles Lakers',
      season: '2019-20',
      minutes: 1698,
      fieldGoalsMade: 643,
      fieldGoalsAttempted: 1303,
      threesMade: 148,
      threesAttempted: 425,
      freeThrowsMade: 264,
      freeThrowsAttempted: 381,
      offensiveRebounds: 66,
      defensiveRebounds: 459,
      assists: 684,
      steals: 78,
      blocks: 36,
      turnovers: 261,
      personalFouls: 118,
      points: 1698,
      leagueAveragePace: 1.0,
      leagueAverageUPER: 15.0
    });
    setErrors({});
  };

  // Render form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Player Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
            Player Name*
          </label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            value={stats.playerName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.playerName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.playerName && <p className="text-red-500 text-xs mt-1">{errors.playerName}</p>}
        </div>
        
        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <input
            type="text"
            id="team"
            name="team"
            value={stats.team}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
            Season
          </label>
          <input
            type="text"
            id="season"
            name="season"
            value={stats.season}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 2023-24"
          />
        </div>
      </div>

      {/* Playing Time */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Playing Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
              Minutes Played*
            </label>
            <input
              type="number"
              id="minutes"
              name="minutes"
              value={stats.minutes}
              onChange={handleChange}
              min="0"
              step="0.1"
              className={`w-full px-3 py-2 border rounded-md ${errors.minutes ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.minutes && <p className="text-red-500 text-xs mt-1">{errors.minutes}</p>}
          </div>
        </div>
      </div>

      {/* Shooting Stats */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Shooting Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fieldGoalsMade" className="block text-sm font-medium text-gray-700 mb-1">
              Field Goals Made
            </label>
            <input
              type="number"
              id="fieldGoalsMade"
              name="fieldGoalsMade"
              value={stats.fieldGoalsMade}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${errors.fieldGoalsMade ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fieldGoalsMade && <p className="text-red-500 text-xs mt-1">{errors.fieldGoalsMade}</p>}
          </div>
          
          <div>
            <label htmlFor="fieldGoalsAttempted" className="block text-sm font-medium text-gray-700 mb-1">
              Field Goals Attempted
            </label>
            <input
              type="number"
              id="fieldGoalsAttempted"
              name="fieldGoalsAttempted"
              value={stats.fieldGoalsAttempted}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="threesMade" className="block text-sm font-medium text-gray-700 mb-1">
              Three-Pointers Made
            </label>
            <input
              type="number"
              id="threesMade"
              name="threesMade"
              value={stats.threesMade}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${errors.threesMade ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.threesMade && <p className="text-red-500 text-xs mt-1">{errors.threesMade}</p>}
          </div>
          
          <div>
            <label htmlFor="threesAttempted" className="block text-sm font-medium text-gray-700 mb-1">
              Three-Pointers Attempted
            </label>
            <input
              type="number"
              id="threesAttempted"
              name="threesAttempted"
              value={stats.threesAttempted}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="freeThrowsMade" className="block text-sm font-medium text-gray-700 mb-1">
              Free Throws Made
            </label>
            <input
              type="number"
              id="freeThrowsMade"
              name="freeThrowsMade"
              value={stats.freeThrowsMade}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${errors.freeThrowsMade ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.freeThrowsMade && <p className="text-red-500 text-xs mt-1">{errors.freeThrowsMade}</p>}
          </div>
          
          <div>
            <label htmlFor="freeThrowsAttempted" className="block text-sm font-medium text-gray-700 mb-1">
              Free Throws Attempted
            </label>
            <input
              type="number"
              id="freeThrowsAttempted"
              name="freeThrowsAttempted"
              value={stats.freeThrowsAttempted}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Rebounding Stats */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Rebounding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="offensiveRebounds" className="block text-sm font-medium text-gray-700 mb-1">
              Offensive Rebounds
            </label>
            <input
              type="number"
              id="offensiveRebounds"
              name="offensiveRebounds"
              value={stats.offensiveRebounds}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="defensiveRebounds" className="block text-sm font-medium text-gray-700 mb-1">
              Defensive Rebounds
            </label>
            <input
              type="number"
              id="defensiveRebounds"
              name="defensiveRebounds"
              value={stats.defensiveRebounds}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Other Stats */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Other Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="assists" className="block text-sm font-medium text-gray-700 mb-1">
              Assists
            </label>
            <input
              type="number"
              id="assists"
              name="assists"
              value={stats.assists}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="steals" className="block text-sm font-medium text-gray-700 mb-1">
              Steals
            </label>
            <input
              type="number"
              id="steals"
              name="steals"
              value={stats.steals}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="blocks" className="block text-sm font-medium text-gray-700 mb-1">
              Blocks
            </label>
            <input
              type="number"
              id="blocks"
              name="blocks"
              value={stats.blocks}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="turnovers" className="block text-sm font-medium text-gray-700 mb-1">
              Turnovers
            </label>
            <input
              type="number"
              id="turnovers"
              name="turnovers"
              value={stats.turnovers}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="personalFouls" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Fouls
            </label>
            <input
              type="number"
              id="personalFouls"
              name="personalFouls"
              value={stats.personalFouls}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
              Points (Optional, for validation)
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={stats.points}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Advanced Options (Collapsible) */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Advanced Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="leagueAveragePace" className="block text-sm font-medium text-gray-700 mb-1">
              League Average Pace Factor
            </label>
            <input
              type="number"
              id="leagueAveragePace"
              name="leagueAveragePace"
              value={stats.leagueAveragePace}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="leagueAverageUPER" className="block text-sm font-medium text-gray-700 mb-1">
              League Average uPER
            </label>
            <input
              type="number"
              id="leagueAverageUPER"
              name="leagueAverageUPER"
              value={stats.leagueAverageUPER}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Calculate PER
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Reset Form
        </button>
        
        <button
          type="button"
          onClick={fillSampleData}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Use Sample Data
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;