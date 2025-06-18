import React from 'react';
import { PERResult } from '../types';

interface ResultsDisplayProps {
  result: PERResult | null;
  playerName: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, playerName }) => {
  if (!result) {
    return null;
  }

  if (!result.valid) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{result.error || 'An unknown error occurred'}</p>
      </div>
    );
  }

  const { per, category, components } = result;

  // Helper function to get a color based on PER value
  const getPerColor = (perValue: number): string => {
    if (perValue >= 30) return 'text-purple-600';
    if (perValue >= 25) return 'text-indigo-600';
    if (perValue >= 20) return 'text-blue-600';
    if (perValue >= 15) return 'text-green-600';
    if (perValue >= 13) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get a background color based on PER value
  const getPerBgColor = (perValue: number): string => {
    if (perValue >= 30) return 'bg-purple-100';
    if (perValue >= 25) return 'bg-indigo-100';
    if (perValue >= 20) return 'bg-blue-100';
    if (perValue >= 15) return 'bg-green-100';
    if (perValue >= 13) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Create component bars for visualization
  const renderComponentBars = () => {
    if (!components) return null;

    const { scoring, rebounding, playmaking, defense, negatives } = components;
    const componentData = [
      { name: 'Scoring', value: scoring, color: 'bg-blue-500' },
      { name: 'Rebounding', value: rebounding, color: 'bg-green-500' },
      { name: 'Playmaking', value: playmaking, color: 'bg-yellow-500' },
      { name: 'Defense', value: defense, color: 'bg-purple-500' },
      { name: 'Negatives', value: Math.abs(negatives), color: 'bg-red-500' },
    ];

    const maxValue = Math.max(...componentData.map(c => Math.abs(c.value))) * 1.2;

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">PER Component Breakdown</h3>
        <div className="space-y-3">
          {componentData.map((component) => (
            <div key={component.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{component.name}</span>
                <span className="font-medium">{component.value.toFixed(2)}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${component.color}`}
                  style={{
                    width: `${(Math.abs(component.value) / maxValue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">
        PER Results for {playerName || 'Player'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PER Value Display */}
        <div className="text-center p-6 rounded-lg border border-gray-200">
          <div className="text-lg text-gray-600 mb-2">Player Efficiency Rating</div>
          <div className={`text-5xl font-bold ${getPerColor(per || 0)}`}>{per?.toFixed(1)}</div>
          <div className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${getPerBgColor(per || 0)}`}>
            {category}
          </div>
        </div>

        {/* Context and Explanation */}
        <div className="">
          <h3 className="text-lg font-medium mb-2">Interpretation</h3>
          <p className="text-gray-600">
            {per && per >= 30 && 'This is an exceptional PER, indicating an all-time great season by NBA standards.'}
            {per && per >= 25 && per < 30 && 'This PER is at MVP candidate level, representing elite performance.'}
            {per && per >= 20 && per < 25 && 'This PER is at All-Star level, indicating excellent production.'}
            {per && per >= 15 && per < 20 && 'This PER indicates a solid starter level of production.'}
            {per && per >= 13 && per < 15 && 'This PER represents a rotation player level of production.'}
            {per && per < 13 && 'This PER indicates a bench player level of production.'}
          </p>
          <p className="text-gray-600 mt-3">
            The league average PER is standardized at 15.0.
          </p>
        </div>
      </div>

      {/* Component Breakdown */}
      {renderComponentBars()}

      {/* Suggestion Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Analysis</h3>
        <p className="text-blue-700">
          {per && per >= 20 && 'This player is performing above league average in efficiency, contributing significant value on the court.'}
          {per && per < 20 && per >= 15 && 'This player is performing at or slightly above league average in efficiency.'}
          {per && per < 15 && 'This player has room to improve their efficiency to reach league average performance.'}
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;