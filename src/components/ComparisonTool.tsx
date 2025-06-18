import React from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { PlayerProfile } from '../types';

const ComparisonTool: React.FC = () => {
  const { savedPlayers, removeSavedPlayer, currentPlayerStats, calculationResult, savePERCalculation } = useCalculator();

  // Function to determine cell background color based on PER value
  const getPerBackgroundColor = (per: number | undefined): string => {
    if (!per) return 'bg-gray-100';
    if (per >= 30) return 'bg-purple-100';
    if (per >= 25) return 'bg-indigo-100';
    if (per >= 20) return 'bg-blue-100';
    if (per >= 15) return 'bg-green-100';
    if (per >= 13) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Function to determine text color based on PER value
  const getPerTextColor = (per: number | undefined): string => {
    if (!per) return 'text-gray-600';
    if (per >= 30) return 'text-purple-800';
    if (per >= 25) return 'text-indigo-800';
    if (per >= 20) return 'text-blue-800';
    if (per >= 15) return 'text-green-800';
    if (per >= 13) return 'text-yellow-800';
    return 'text-red-800';
  };

  // Calculate per-minute stats for a player
  const calculatePerMinuteStats = (player: PlayerProfile) => {
    const minutes = player.minutes || 1; // Avoid division by zero
    return {
      points: (((player.fieldGoalsMade - player.threesMade) * 2) + (player.threesMade * 3) + player.freeThrowsMade) / minutes,
      rebounds: (player.offensiveRebounds + player.defensiveRebounds) / minutes,
      assists: player.assists / minutes,
      steals: player.steals / minutes,
      blocks: player.blocks / minutes,
      turnovers: player.turnovers / minutes
    };
  };

  // Can save current calculation if valid
  const canSaveCurrent = currentPlayerStats && calculationResult && calculationResult.valid;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Player Comparison</h2>
        
        {canSaveCurrent && (
          <button 
            onClick={savePERCalculation}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Save Current Result
          </button>
        )}
      </div>
      
      {savedPlayers.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500">No players saved for comparison yet.</p>
          <p className="text-gray-500 mt-2">Calculate a PER and save the result to compare players.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Player</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">PER</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Pts/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Reb/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Ast/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Stl/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Blk/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">To/Min</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {savedPlayers.map((player, index) => {
                const perMinuteStats = calculatePerMinuteStats(player);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{player.playerName}</div>
                      <div className="text-xs text-gray-500">
                        {player.team}{player.team && player.season ? ', ' : ''}{player.season}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-center font-bold ${getPerBackgroundColor(player.perResult.per)} ${getPerTextColor(player.perResult.per)}`}>
                      {player.perResult.per?.toFixed(1) || 'N/A'}
                      <div className="text-xs font-normal">{player.perResult.category}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.points.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.rebounds.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.assists.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.steals.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.blocks.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-sm">{perMinuteStats.turnovers.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeSavedPlayer(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">About This Comparison Tool</h3>
        <p className="text-blue-700 text-sm">
          This tool allows you to save and compare multiple players' PER calculations. All statistics are shown per minute
          to allow fair comparison between players with different playing times. Remember that PER is already adjusted to 
          account for pace and league averages, providing a standardized measure of player efficiency.
        </p>
      </div>
    </div>
  );
};

export default ComparisonTool;