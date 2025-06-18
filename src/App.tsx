import React, { useState } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import ComparisonTool from './components/ComparisonTool';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext';
import { PlayerStats } from './types';

// Calculator tab content as a separate component to access context
const CalculatorTab: React.FC = () => {
  const { calculatePlayerPER, calculationResult, currentPlayerStats } = useCalculator();
  
  const handleCalculate = (stats: PlayerStats) => {
    calculatePlayerPER(stats);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">PER Calculator</h2>
      <p className="text-gray-600 mb-6">
        Enter a player's statistics below to calculate their Player Efficiency Rating (PER).
      </p>
      
      {/* Calculator Form */}
      <CalculatorForm onCalculate={handleCalculate} />
      
      {/* Results Display */}
      {calculationResult && (
        <div className="mt-8">
          <ResultsDisplay 
            result={calculationResult} 
            playerName={currentPlayerStats?.playerName || 'Player'} 
          />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'compare' | 'about'>('calculator');

  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Player Efficiency Rating Calculator</h1>
            <p className="text-blue-100 mt-2">
              Analyze basketball player performance with the comprehensive PER metric
            </p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`py-4 px-2 font-medium border-b-2 ${
                  activeTab === 'calculator' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-blue-500'
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`py-4 px-2 font-medium border-b-2 ${
                  activeTab === 'compare' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-blue-500'
                }`}
              >
                Compare Players
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-2 font-medium border-b-2 ${
                  activeTab === 'about' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-blue-500'
                }`}
              >
                About PER
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'calculator' && <CalculatorTab />}

          {activeTab === 'compare' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <ComparisonTool />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About Player Efficiency Rating</h2>
              
              <div className="prose max-w-none">
                <p>
                  Player Efficiency Rating (PER) is a rating of a player's per-minute productivity developed by ESPN NBA analyst John Hollinger.
                </p>
                
                <h3 className="font-bold text-xl mt-6 mb-3">The Formula</h3>
                <p>
                  PER takes into account positive accomplishments (field goals, free throws, 3-pointers, assists, rebounds, blocks, and steals) 
                  and negative ones (missed shots, turnovers, and personal fouls).
                </p>
                
                <div className="bg-gray-100 p-4 rounded my-4 overflow-x-auto">
                  <code className="text-sm">
                    uPER = (1/MP) * [3P + 2*2P + (2/3)*FT - 0.8*FTA - 0.4*(FGA-FGM) - 0.4*(3PA-3PM) - TO + 0.7*ORB + 0.3*DRB + STL + 0.7*AST + 0.7*BLK - 0.4*PF]
                  </code>
                </div>
                
                <p>
                  This is then adjusted for team pace and normalized so the league average is 15.
                </p>
                
                <h3 className="font-bold text-xl mt-6 mb-3">Interpreting PER</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>30+ PER:</strong> All-time great season</li>
                  <li><strong>25-30 PER:</strong> MVP candidate</li>
                  <li><strong>20-25 PER:</strong> All-Star caliber</li>
                  <li><strong>15-20 PER:</strong> Solid starter</li>
                  <li><strong>13-15 PER:</strong> Rotation player</li>
                  <li><strong>&lt;13 PER:</strong> Bench player</li>
                </ul>
                
                <p>
                  The league average PER is always set at 15.00, which makes it easy to compare players across different seasons.
                </p>
              </div>
            </div>
          )}
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <p className="text-center">
              &copy; 2025 Player Efficiency Rating Calculator | Developed by DxAG | <span className="text-blue-300">v0.1.0</span>
            </p>
          </div>
        </footer>
      </div>
    </CalculatorProvider>
  );
};

export default App;