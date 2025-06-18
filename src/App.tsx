import React, { useState } from 'react';
import { CalculatorProvider } from './context/CalculatorContext';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import ComparisonTool from './components/ComparisonTool';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'advanced'>('calculator');

  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">Player Efficiency Rating Calculator</h1>
            <p className="text-center text-blue-100 mt-2">
              Analyze basketball player performance with the PER metric
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex border-b">
              <button
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'calculator'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('calculator')}
              >
                PER Calculator
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'advanced'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced Options
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'calculator' ? (
                <div className="text-sm text-gray-600">
                  <p>
                    Enter a player's statistics to calculate their Player Efficiency Rating (PER).
                    This metric provides a comprehensive assessment of a player's overall contribution.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>
                    Advanced options allow you to customize PER formula weights and compare with historical data.
                    This section is coming soon in a future update.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <CalculatorForm />
            
            <ResultsDisplay />
            
            <ComparisonTool />
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-blue-800 mb-4">About Player Efficiency Rating (PER)</h2>
            <div className="text-blue-700 space-y-4">
              <p>
                Player Efficiency Rating (PER) is a per-minute rating developed by NBA analyst John Hollinger. 
                It is designed to sum up all a player's positive accomplishments, subtract the negative 
                accomplishments, and return a per-minute rating of a player's performance.
              </p>
              <p>
                PER takes into account positive accomplishments, such as field goals, free throws, 3-pointers, 
                assists, rebounds, blocks and steals, and negative ones, such as missed shots, turnovers and 
                personal fouls.
              </p>
              <p>
                The formula adds a value to a player's rating for minutes played as well as for a team's pace 
                of play. The league average PER is set to 15.00 every season.
              </p>
              <p className="font-medium">
                PER Ratings Scale:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>30+ PER: All-time great season</li>
                <li>25-30 PER: MVP candidate</li>
                <li>20-25 PER: All-Star caliber</li>
                <li>15-20 PER: Solid starter</li>
                <li>13-15 PER: Rotation player</li>
                <li>&lt;13 PER: Bench player</li>
              </ul>
            </div>
          </div>
        </main>

        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Player Efficiency Rating (PER) Calculator &copy; 2025
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This tool is designed for educational and analytical purposes. PER was developed by John Hollinger.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CalculatorProvider>
  );
};

export default App;