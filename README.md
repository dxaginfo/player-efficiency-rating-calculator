# Player Efficiency Rating (PER) Calculator

An interactive web application for calculating, analyzing, and visualizing NBA players' efficiency ratings using the PER formula.

## Overview

The Player Efficiency Rating (PER) Calculator is a tool designed to help basketball analysts, coaches, and enthusiasts evaluate player performance through John Hollinger's comprehensive PER metric. This formula captures a player's all-around contributions, including positive actions (scoring, rebounds, assists, steals, blocks) and negative ones (missed shots, turnovers, fouls).

## Features

- 🧮 **PER Calculator**: Input player stats to calculate their efficiency rating
- 📊 **Data Visualization**: View PER components in interactive charts
- 🔄 **Player Comparison**: Compare multiple players side-by-side
- 📏 **Benchmark Analysis**: See how a player stacks up against league averages
- ⚙️ **Customizable Weights**: Adjust formula parameters for custom analysis

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Visualization**: Recharts
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dxaginfo/player-efficiency-rating-calculator.git
   cd player-efficiency-rating-calculator
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
/src
  /components
    /CalculatorForm      # Input form for player statistics
    /ResultsDisplay      # PER results visualization
    /ComparisonTool      # Player comparison interface
    /Visualizations      # Chart components
  /utils
    perCalculations.ts   # PER formula implementation
    dataValidation.ts    # Input validation utilities
    chartHelpers.ts      # Chart configuration helpers
  /context
    CalculatorContext.tsx # Application state management
  /hooks
    usePerCalculation.ts  # Custom hook for PER calculations
  /types
    index.ts             # TypeScript type definitions
  App.tsx                # Main application component
  index.tsx              # Application entry point
```

## Understanding PER

### The Formula

Player Efficiency Rating is calculated using the formula:

```
uPER = (1/MP) * [3P + 2*2P + (2/3)*FT - 0.8*FTA - 0.4*(FGA-FGM) - 0.4*(3PA-3PM) - TO + 0.7*ORB + 0.3*DRB + STL + 0.7*AST + 0.7*BLK - 0.4*PF]
```

This is then normalized to ensure the league average is 15:

```
PER = [uPER * (league pace adjustment)] * (15 / league average uPER)
```

### Interpreting PER

| PER Range | Rating        |
|-----------|---------------|
| >30       | All-time great|
| 25-30     | MVP candidate |
| 20-25     | All-Star      |
| 15-20     | Starter       |
| 13-15     | Rotation      |
| <13       | Bench         |

## Future Enhancements

- Integration with basketball stats APIs
- Team analysis tools
- Historical data comparisons
- Projection capabilities
- Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- John Hollinger for developing the PER metric
- Basketball statisticians and analysts who continue to evolve the field