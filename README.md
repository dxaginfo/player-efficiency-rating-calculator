# Player Efficiency Rating (PER) Calculator

An interactive web application for calculating, visualizing, and analyzing basketball player performance using the Player Efficiency Rating (PER) metric.

## Overview

The Player Efficiency Rating Calculator is designed for basketball analysts, coaches, and fans who want to evaluate player performance using John Hollinger's comprehensive PER metric. This tool provides insights into a player's overall contribution on the court, breaking down efficiency into key components and allowing for player comparisons.

![PER Calculator Screenshot](https://via.placeholder.com/800x450.png?text=PER+Calculator+Screenshot)

## Features

- **Complete PER Calculation Engine**: Accurate implementation of the Player Efficiency Rating formula
- **Interactive Input Form**: User-friendly interface for entering player statistics with validation
- **Visual Results Display**: Clear visualization of PER score with rating interpretation
- **Component Breakdown**: Analysis of how different aspects of play contribute to the overall rating
- **Player Comparison Tool**: Compare performance against other players
- **Educational Context**: Learn about what PER means and how it's calculated

## Technologies Used

- **React**: Frontend framework with TypeScript for type safety
- **Context API**: State management
- **Tailwind CSS**: Responsive styling
- **Chart Components**: Data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dxaginfo/player-efficiency-rating-calculator.git
   ```

2. Navigate to the project directory:
   ```
   cd player-efficiency-rating-calculator
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Enter Player Stats**: Fill in the player statistics form with the required data
2. **Calculate PER**: Click the "Calculate PER" button to generate results
3. **View Results**: See the calculated PER value, rating category, and visual breakdown
4. **Compare Players**: Use the comparison tool to add and compare different players

## Understanding PER

Player Efficiency Rating (PER) is a per-minute rating developed by NBA analyst John Hollinger. It's designed to sum up all a player's positive accomplishments, subtract the negative accomplishments, and return a per-minute rating of a player's performance.

### PER Ratings Scale:

- **30+ PER**: All-time great season
- **25-30 PER**: MVP candidate
- **20-25 PER**: All-Star caliber
- **15-20 PER**: Solid starter
- **13-15 PER**: Rotation player
- **<13 PER**: Bench player

The league average PER is set to 15.00 every season.

## Project Structure

```
src/
├── components/           # React components
│   ├── CalculatorForm/   # Form for inputting player statistics
│   ├── ResultsDisplay/   # Display of calculation results
│   └── ComparisonTool/   # Player comparison functionality
├── context/              # React Context for state management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
│   └── perCalculations.ts  # Core PER calculation logic
├── App.tsx               # Main application component
└── index.tsx             # Application entry point
```

## Future Enhancements

- Advanced formula customization
- NBA API integration for real-time stats
- Historical player database
- Team-level PER analysis
- Data export functionality
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- John Hollinger for developing the PER metric
- Basketball statisticians and analysts who continue to evolve performance metrics