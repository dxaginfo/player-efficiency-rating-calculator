import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { PerResult, PerComponents } from '../../types';

// Helper to get color for PER rating
const getPerColor = (per: number): string => {
  if (per >= 30) return 'text-purple-700';
  if (per >= 25) return 'text-red-600';
  if (per >= 20) return 'text-orange-500';
  if (per >= 15) return 'text-green-600';
  if (per >= 13) return 'text-blue-500';
  return 'text-gray-600';
};

// Helper to get background color for PER rating
const getPerBgColor = (per: number): string => {
  if (per >= 30) return 'bg-purple-100';
  if (per >= 25) return 'bg-red-100';
  if (per >= 20) return 'bg-orange-100';
  if (per >= 15) return 'bg-green-100';
  if (per >= 13) return 'bg-blue-100';
  return 'bg-gray-100';
};

// Helper to get the gauge percentage
const getGaugePercentage = (per: number): number => {
  // Scale from 0 to 35 (max realistic PER value)
  const scaledPer = Math.max(0, Math.min(per, 35));
  return (scaledPer / 35) * 100;
};

// Component to display a color-coded gauge for PER value
const PerGauge: React.FC<{ per: number }> = ({ per }) => {
  const percentage = getGaugePercentage(per);
  const color = getPerColor(per).replace('text-', 'bg-');
  
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Component to display PER components as a bar chart
const PerComponentsChart: React.FC<{ components: PerComponents }> = ({ components }) => {
  const { 
    scoringContribution, 
    reboundingContribution, 
    assistContribution, 
    defensiveContribution, 
    negativeContribution 
  } = components;
  
  // Calculate the positive components sum for scaling
  const positiveSum = scoringContribution + reboundingContribution + 
                     assistContribution + defensiveContribution;
  
  // Scale negative contribution so it doesn't overwhelm the chart
  const scaledNegative = Math.abs(negativeContribution);
  
  // Get width percentages for each component
  const scoringWidth = (scoringContribution / positiveSum) * 100;
  const reboundingWidth = (reboundingContribution / positiveSum) * 100;
  const assistWidth = (assistContribution / positiveSum) * 100;
  const defensiveWidth = (defensiveContribution / positiveSum) * 100;
  
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">PER Components</div>
      
      <div className="flex h-8 rounded-lg overflow-hidden">
        <div 
          style={{ width: `${scoringWidth}%` }} 
          className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
          title={`Scoring: ${scoringContribution.toFixed(1)}`}
        >
          {scoringWidth > 10 && "Scoring"}
        </div>
        <div 
          style={{ width: `${reboundingWidth}%` }} 
          className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
          title={`Rebounding: ${reboundingContribution.toFixed(1)}`}
        >
          {reboundingWidth > 10 && "Rebounds"}
        </div>
        <div 
          style={{ width: `${assistWidth}%` }} 
          className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
          title={`Assists: ${assistContribution.toFixed(1)}`}
        >
          {assistWidth > 10 && "Assists"}
        </div>
        <div 
          style={{ width: `${defensiveWidth}%` }} 
          className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
          title={`Defense: ${defensiveContribution.toFixed(1)}`}
        >
          {defensiveWidth > 10 && "Defense"}
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-700">Negative Factors</div>
      <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
        <div 
          style={{ width: `${Math.min(scaledNegative * 5, 100)}%` }} 
          className="bg-gray-500 h-full flex items-center justify-start px-2"
        >
          <span className="text-xs text-white font-medium">
            {negativeContribution.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Scoring: {scoringContribution.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Rebounds: {reboundingContribution.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Assists: {assistContribution.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
          <span>Defense: {defensiveContribution.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

// Component to display the PER benchmark
const PerBenchmark: React.FC<{ per: number }> = ({ per }) => {
  const benchmarks = [
    { label: 'All-time great', value: 30, color: 'bg-purple-500' },
    { label: 'MVP candidate', value: 25, color: 'bg-red-500' },
    { label: 'All-Star', value: 20, color: 'bg-orange-500' },
    { label: 'Starter', value: 15, color: 'bg-green-500' },
    { label: 'Rotation', value: 13, color: 'bg-blue-500' },
    { label: 'Bench', value: 0, color: 'bg-gray-500' },
  ];
  
  return (
    <div className="relative h-64 flex items-center">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
        {benchmarks.map((benchmark, index) => (
          <div key={index} className="relative h-0.5 w-full bg-gray-200 flex items-center">
            <span className="absolute left-0 text-xs text-gray-600 -mt-4">
              {benchmark.value}
            </span>
            <span className="absolute left-16 text-xs text-gray-600 -mt-4">
              {benchmark.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className="absolute left-8 h-full w-0.5 bg-gray-300"></div>
      
      <div 
        className="absolute left-8 w-6 h-6 rounded-full bg-blue-600 shadow-md transform -translate-x-1/2 flex items-center justify-center"
        style={{ bottom: `${(per / 35) * 100}%` }}
      >
        <span className="text-xs font-bold text-white">{per.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Main ResultsDisplay component
const ResultsDisplay: React.FC = () => {
  const { state } = useCalculator();
  const { perResult, error } = state;
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!perResult) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-800 mb-2">No Results Yet</h2>
        <p className="text-blue-700">
          Enter player statistics in the form above and click "Calculate PER" to see results.
        </p>
      </div>
    );
  }
  
  const { playerName, adjustedPer, rating, components } = perResult;
  const perColor = getPerColor(adjustedPer);
  const perBgColor = getPerBgColor(adjustedPer);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">PER Results</h2>
      <p className="text-gray-600 mb-6">Player Efficiency Rating for {playerName}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className={`${perBgColor} p-6 rounded-lg shadow-sm mb-6`}>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-1">Player Efficiency Rating</h3>
              <div className={`text-5xl font-bold ${perColor}`}>
                {adjustedPer.toFixed(1)}
              </div>
              <div className={`text-xl font-semibold mt-2 ${perColor}`}>
                {rating}
              </div>
            </div>
            
            <div className="mt-4">
              <PerGauge per={adjustedPer} />
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                PER (Player Efficiency Rating) measures a player's per-minute productivity. 
                The league average is 15.0.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <PerComponentsChart components={components} />
          </div>
        </div>
        
        <div className="bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Rating</h3>
          <PerBenchmark per={adjustedPer} />
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What does this PER rating mean?</h4>
            <p className="text-sm text-blue-700">
              {rating === 'All-time great' && 
                'This rating indicates one of the greatest seasons ever played in NBA history. Players with PER above 30 include all-time legends like Michael Jordan, LeBron James, and Wilt Chamberlain in their very best seasons.'}
              {rating === 'MVP candidate' && 
                'This exceptional rating is typically achieved by players who are serious contenders for the NBA Most Valuable Player award. Only a handful of players each season reach this level of efficiency.'}
              {rating === 'All-Star' && 
                'This outstanding rating typically represents All-Star level performance. Players in this range are usually among the best at their position and make significant contributions to their team.'}
              {rating === 'Starter' && 
                'This solid rating indicates a quality starter who contributes positively to their team. Players in this range are typically reliable contributors who play significant minutes.'}
              {rating === 'Rotation player' && 
                'This rating suggests a reliable rotation player who can contribute off the bench or as a role-specific starter. These players fulfill specific roles on their teams.'}
              {rating === 'Bench player' && 
                'This rating indicates a bench player or a developing talent. Players in this range typically have limited minutes or specialized roles.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;