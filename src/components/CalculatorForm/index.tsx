import React, { useState } from 'react';
import { PlayerStats } from '../../types';
import { useCalculator } from '../../context/CalculatorContext';
import { generateSamplePlayerStats } from '../../utils/perCalculations';

interface FormErrors {
  [key: string]: string;
}

const CalculatorForm: React.FC = () => {
  const { calculatePlayerPER, state } = useCalculator();
  const { isCalculating } = state;

  // Initialize form with empty player stats
  const [formData, setFormData] = useState<PlayerStats>({
    playerName: '',
    team: '',
    position: '',
    season: '',
    gamesPlayed: 0,
    minutesPlayed: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    offensiveRebounds: 0,
    defensiveRebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    personalFouls: 0,
  });

  // State for form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert number inputs to actual numbers
    const isNumberField = name !== 'playerName' && name !== 'team' && 
                          name !== 'position' && name !== 'season';
    
    const parsedValue = isNumberField ? 
      (value === '' ? 0 : parseFloat(value)) : 
      value;
    
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Load sample data for demonstration
  const loadSampleData = () => {
    const sampleData = generateSamplePlayerStats();
    setFormData(sampleData);
    setErrors({});
  };

  // Clear the form
  const clearForm = () => {
    setFormData({
      playerName: '',
      team: '',
      position: '',
      season: '',
      gamesPlayed: 0,
      minutesPlayed: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointersMade: 0,
      threePointersAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      offensiveRebounds: 0,
      defensiveRebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      personalFouls: 0,
    });
    setErrors({});
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Check required fields
    if (!formData.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }
    
    if (formData.gamesPlayed <= 0) {
      newErrors.gamesPlayed = 'Games played must be greater than 0';
    }
    
    if (formData.minutesPlayed <= 0) {
      newErrors.minutesPlayed = 'Minutes played must be greater than 0';
    }
    
    // Check logical constraints
    if (formData.fieldGoalsMade > formData.fieldGoalsAttempted) {
      newErrors.fieldGoalsMade = 'Field goals made cannot exceed attempts';
    }
    
    if (formData.threePointersMade > formData.threePointersAttempted) {
      newErrors.threePointersMade = 'Three pointers made cannot exceed attempts';
    }
    
    if (formData.freeThrowsMade > formData.freeThrowsAttempted) {
      newErrors.freeThrowsMade = 'Free throws made cannot exceed attempts';
    }
    
    if (formData.threePointersMade > formData.fieldGoalsMade) {
      newErrors.threePointersMade = 'Three pointers made cannot exceed total field goals made';
    }
    
    if (formData.threePointersAttempted > formData.fieldGoalsAttempted) {
      newErrors.threePointersAttempted = 'Three pointers attempted cannot exceed total field goals attempted';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      calculatePlayerPER(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Player Statistics Input</h2>
      
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={loadSampleData}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
        >
          Load Sample Data
        </button>
        
        <button
          type="button"
          onClick={clearForm}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Clear Form
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Player Identification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="playerName" className="block font-medium text-gray-700">
              Player Name*
            </label>
            <input
              type="text"
              id="playerName"
              name="playerName"
              value={formData.playerName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.playerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="LeBron James"
            />
            {errors.playerName && (
              <p className="text-red-500 text-sm">{errors.playerName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="team" className="block font-medium text-gray-700">
              Team
            </label>
            <input
              type="text"
              id="team"
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Los Angeles Lakers"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="position" className="block font-medium text-gray-700">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Position</option>
              <option value="PG">Point Guard (PG)</option>
              <option value="SG">Shooting Guard (SG)</option>
              <option value="SF">Small Forward (SF)</option>
              <option value="PF">Power Forward (PF)</option>
              <option value="C">Center (C)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="season" className="block font-medium text-gray-700">
              Season
            </label>
            <input
              type="text"
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="2024-2025"
            />
          </div>
        </div>
        
        {/* Games and Minutes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="gamesPlayed" className="block font-medium text-gray-700">
              Games Played*
            </label>
            <input
              type="number"
              id="gamesPlayed"
              name="gamesPlayed"
              value={formData.gamesPlayed || ''}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.gamesPlayed ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.gamesPlayed && (
              <p className="text-red-500 text-sm">{errors.gamesPlayed}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="minutesPlayed" className="block font-medium text-gray-700">
              Minutes Played*
            </label>
            <input
              type="number"
              id="minutesPlayed"
              name="minutesPlayed"
              value={formData.minutesPlayed || ''}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.minutesPlayed ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.minutesPlayed && (
              <p className="text-red-500 text-sm">{errors.minutesPlayed}</p>
            )}
          </div>
        </div>
        
        {/* Field Goals */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Scoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="fieldGoalsMade" className="block font-medium text-gray-700">
                Field Goals Made
              </label>
              <input
                type="number"
                id="fieldGoalsMade"
                name="fieldGoalsMade"
                value={formData.fieldGoalsMade || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.fieldGoalsMade ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fieldGoalsMade && (
                <p className="text-red-500 text-sm">{errors.fieldGoalsMade}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fieldGoalsAttempted" className="block font-medium text-gray-700">
                Field Goals Attempted
              </label>
              <input
                type="number"
                id="fieldGoalsAttempted"
                name="fieldGoalsAttempted"
                value={formData.fieldGoalsAttempted || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.fieldGoalsAttempted ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fieldGoalsAttempted && (
                <p className="text-red-500 text-sm">{errors.fieldGoalsAttempted}</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <p className="block font-medium text-gray-700">FG%</p>
              <p className="mt-2 py-2 px-3 bg-gray-100 rounded-md">
                {formData.fieldGoalsAttempted > 0
                  ? ((formData.fieldGoalsMade / formData.fieldGoalsAttempted) * 100).toFixed(1) + '%'
                  : '0.0%'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="threePointersMade" className="block font-medium text-gray-700">
                3-Pointers Made
              </label>
              <input
                type="number"
                id="threePointersMade"
                name="threePointersMade"
                value={formData.threePointersMade || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.threePointersMade ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.threePointersMade && (
                <p className="text-red-500 text-sm">{errors.threePointersMade}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="threePointersAttempted" className="block font-medium text-gray-700">
                3-Pointers Attempted
              </label>
              <input
                type="number"
                id="threePointersAttempted"
                name="threePointersAttempted"
                value={formData.threePointersAttempted || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.threePointersAttempted ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.threePointersAttempted && (
                <p className="text-red-500 text-sm">{errors.threePointersAttempted}</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <p className="block font-medium text-gray-700">3P%</p>
              <p className="mt-2 py-2 px-3 bg-gray-100 rounded-md">
                {formData.threePointersAttempted > 0
                  ? ((formData.threePointersMade / formData.threePointersAttempted) * 100).toFixed(1) + '%'
                  : '0.0%'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="freeThrowsMade" className="block font-medium text-gray-700">
                Free Throws Made
              </label>
              <input
                type="number"
                id="freeThrowsMade"
                name="freeThrowsMade"
                value={formData.freeThrowsMade || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.freeThrowsMade ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.freeThrowsMade && (
                <p className="text-red-500 text-sm">{errors.freeThrowsMade}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="freeThrowsAttempted" className="block font-medium text-gray-700">
                Free Throws Attempted
              </label>
              <input
                type="number"
                id="freeThrowsAttempted"
                name="freeThrowsAttempted"
                value={formData.freeThrowsAttempted || ''}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.freeThrowsAttempted ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.freeThrowsAttempted && (
                <p className="text-red-500 text-sm">{errors.freeThrowsAttempted}</p>
              )}
            </div>
            
            <div className="md:col-span-1">
              <p className="block font-medium text-gray-700">FT%</p>
              <p className="mt-2 py-2 px-3 bg-gray-100 rounded-md">
                {formData.freeThrowsAttempted > 0
                  ? ((formData.freeThrowsMade / formData.freeThrowsAttempted) * 100).toFixed(1) + '%'
                  : '0.0%'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Rebounds, Assists, etc. */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Other Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="offensiveRebounds" className="block font-medium text-gray-700">
                Offensive Rebounds
              </label>
              <input
                type="number"
                id="offensiveRebounds"
                name="offensiveRebounds"
                value={formData.offensiveRebounds || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="defensiveRebounds" className="block font-medium text-gray-700">
                Defensive Rebounds
              </label>
              <input
                type="number"
                id="defensiveRebounds"
                name="defensiveRebounds"
                value={formData.defensiveRebounds || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-1">
              <p className="block font-medium text-gray-700">Total Rebounds</p>
              <p className="mt-2 py-2 px-3 bg-gray-100 rounded-md">
                {formData.offensiveRebounds + formData.defensiveRebounds}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assists" className="block font-medium text-gray-700">
                Assists
              </label>
              <input
                type="number"
                id="assists"
                name="assists"
                value={formData.assists || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="steals" className="block font-medium text-gray-700">
                Steals
              </label>
              <input
                type="number"
                id="steals"
                name="steals"
                value={formData.steals || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="blocks" className="block font-medium text-gray-700">
                Blocks
              </label>
              <input
                type="number"
                id="blocks"
                name="blocks"
                value={formData.blocks || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="turnovers" className="block font-medium text-gray-700">
                Turnovers
              </label>
              <input
                type="number"
                id="turnovers"
                name="turnovers"
                value={formData.turnovers || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="personalFouls" className="block font-medium text-gray-700">
                Personal Fouls
              </label>
              <input
                type="number"
                id="personalFouls"
                name="personalFouls"
                value={formData.personalFouls || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`px-6 py-3 bg-blue-600 text-white rounded-md font-semibold ${
              isCalculating ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
            } transition`}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </span>
            ) : (
              'Calculate PER'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CalculatorForm;