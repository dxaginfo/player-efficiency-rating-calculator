import React, { useState } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { generateComparisonPlayers } from '../../utils/perCalculations';

// Helper to get color for PER rating
const getPerColor = (per: number): string => {
  if (per >= 30) return 'text-purple-700';
  if (per >= 25) return 'text-red-600';
  if (per >= 20) return 'text-orange-500';
  if (per >= 15) return 'text-green-600';
  if (per >= 13) return 'text-blue-500';
  return 'text-gray-600';
};

const ComparisonTool: React.FC = () => {
  const { state, addComparisonPlayer, removeComparisonPlayer } = useCalculator();
  const { perResult, comparisonPlayers } = state;
  const [isLoading, setIsLoading] = useState(false);

  // Load sample comparison players
  const handleLoadSamplePlayers = async () => {
    setIsLoading(true);
    try {
      const samplePlayers = generateComparisonPlayers();
      // Process each player in sequence
      for (const player of samplePlayers) {
        await addComparisonPlayer(player);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all comparison players
  const handleClearComparisons = () => {
    if (comparisonPlayers.length > 0) {
      // Remove each player
      comparisonPlayers.forEach(player => {
        if (player.playerId) {
          removeComparisonPlayer(player.playerId);
        }
      });
    }
  };

  // Calculate max PER for scaling the bars
  const maxPer = Math.max(
    perResult?.adjustedPer || 0,
    ...comparisonPlayers.map(p => p.adjustedPer)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Player Comparison</h2>
        <div className="space-x-2">
          <button
            onClick={handleLoadSamplePlayers}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md text-sm ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Loading...' : 'Load Sample Players'}
          </button>
          <button
            onClick={handleClearComparisons}
            disabled={isLoading || comparisonPlayers.length === 0}
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm ${
              isLoading || comparisonPlayers.length === 0
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-gray-300'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>

      {!perResult && comparisonPlayers.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-blue-700">
            Calculate a player's PER first, then add comparison players to see how they stack up.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PER</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Comparison</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Current player row */}
              {perResult && (
                <tr className="bg-blue-50 border-b">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {perResult.playerName}
                    <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold ${getPerColor(perResult.adjustedPer)}`}>
                    {perResult.adjustedPer.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{perResult.rating}</td>
                  <td className="px-4 py-3">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(perResult.adjustedPer / maxPer) * 100}%` }}
                        className="h-full bg-blue-600"
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              )}

              {/* Comparison players rows */}
              {comparisonPlayers.map((player, index) => (
                <tr key={player.playerId || index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {player.playerName}
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold ${getPerColor(player.adjustedPer)}`}>
                    {player.adjustedPer.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{player.rating}</td>
                  <td className="px-4 py-3">
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(player.adjustedPer / maxPer) * 100}%` }}
                        className="h-full bg-green-500"
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => player.playerId && removeComparisonPlayer(player.playerId)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove from comparison"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {perResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">PER Comparison Insights</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {comparisonPlayers.length === 0 ? (
              <p>Add comparison players to see insights.</p>
            ) : (
              <>
                <p>
                  <strong>{perResult.playerName}'s PER of {perResult.adjustedPer.toFixed(1)}</strong> ranks
                  {' '}
                  {comparisonPlayers.filter(p => p.adjustedPer > perResult.adjustedPer).length === 0
                    ? <span className="text-green-600 font-medium">highest</span>
                    : comparisonPlayers.filter(p => p.adjustedPer > perResult.adjustedPer).length === comparisonPlayers.length
                    ? <span className="text-red-600 font-medium">lowest</span>
                    : <span className="text-blue-600 font-medium">
                        {comparisonPlayers.filter(p => p.adjustedPer > perResult.adjustedPer).length + 1} 
                        {' of '} 
                        {comparisonPlayers.length + 1}
                      </span>
                  } among the compared players.
                </p>
                {comparisonPlayers.length > 0 && (
                  <p>
                    The average PER of comparison players is{' '}
                    <span className="font-medium">
                      {(comparisonPlayers.reduce((sum, p) => sum + p.adjustedPer, 0) / comparisonPlayers.length).toFixed(1)}
                    </span>.
                  </p>
                )}
                {comparisonPlayers.length > 0 && 
                  perResult.adjustedPer > comparisonPlayers.reduce((sum, p) => sum + p.adjustedPer, 0) / comparisonPlayers.length && (
                  <p className="text-green-600">
                    {perResult.playerName} is performing above the comparison group average.
                  </p>
                )}
                {comparisonPlayers.length > 0 && 
                  perResult.adjustedPer < comparisonPlayers.reduce((sum, p) => sum + p.adjustedPer, 0) / comparisonPlayers.length && (
                  <p className="text-orange-600">
                    {perResult.playerName} is performing below the comparison group average.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;