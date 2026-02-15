# E2E Testing Documentation

This directory contains end-to-end (E2E) tests for the Insider One Case Study race simulation application using Cypress.

## 📁 Directory Structure

```
cypress/
└── e2e/
    ├── fixtures/          # Test data and mock objects
    │   └── horses.ts      # Sample horse data for testing
    ├── race/              # Race-specific test suites
    │   └── race-simulation.cy.ts
    ├── support/           # Custom commands and configuration
    │   ├── commands.ts    # Reusable Cypress commands
    │   └── e2e.ts         # Support file configuration
    ├── screenshots/       # Failed test screenshots (auto-generated)
    └── videos/            # Test execution videos (auto-generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- Application running on `http://localhost:5173`

### Running Tests

```bash
# Open Cypress Test Runner (interactive mode)
npm run cypress:open

# Run tests headlessly (CI mode)
npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/race/race-simulation.cy.ts"
```

## 🧪 Test Suites

### Race Simulation Tests (`race/race-simulation.cy.ts`)

Comprehensive E2E tests for the race simulation feature, covering:

#### 1. **Dashboard Loading**
- Verifies race dashboard loads successfully
- Checks horse list is displayed

#### 2. **Horse Display**
- Validates all 20 horses are rendered before race starts
- Verifies horse details (name, condition) are visible

#### 3. **Program Generation**
- Tests program generation button functionality
- Verifies 60 race horses are selected (10 per race × 6 races)
- Checks horse silhouettes appear on race track

#### 4. **Race Start**
- Tests race start button functionality
- Verifies race track visibility
- Validates horse movement by checking CSS `left` property changes

#### 5. **Single Round Completion**
- Waits for first round to complete
- Verifies results table is populated with 10 horses

#### 6. **Multi-Round Completion**
- Tests all 6 rounds complete automatically
- Validates results for each round sequentially
- Ensures all 10 horses have results per round

#### 7. **Race Reset**
- Tests ability to start a new race after completion
- Verifies "Generate Program" and "Start" buttons are re-enabled

## 🛠️ Custom Commands

Custom Cypress commands are defined in `support/commands.ts` to improve test readability and reusability:

### `cy.visitRaceDashboard()`
Navigates to the race dashboard homepage.

```typescript
cy.visitRaceDashboard();
```

### `cy.generateProgram()`
Clicks the "Generate Program" button to create race lineup.

```typescript
cy.generateProgram();
```

### `cy.startRace()`
Clicks the "Start" button to begin the race simulation.

```typescript
cy.startRace();
```

### `cy.waitForRoundCompletion(round)`
Waits for a specific round to complete with appropriate timing calculations.

```typescript
await cy.waitForRoundCompletion(1); // Wait for round 1
await cy.waitForRoundCompletion(2); // Wait for round 2
```

**Timing Logic:**
- Round 1: No countdown delay
- Rounds 2-6: 4000ms countdown + race time
- Race time: `round × 1000 + 8000` ms

### `cy.waitForRaceCompletion()`
Waits for all 6 rounds to complete (up to 120 seconds timeout).

```typescript
cy.waitForRaceCompletion();
```

## 📊 Test Data

### Fixtures (`fixtures/horses.ts`)

Sample horse data for testing purposes:

```typescript
{
  id: number;
  name: string;
  condition: number;  // 0-100
  color: string;      // HSL format: "hue, saturation%, lightness%"
}
```

Example horses include:
- Thunder Bolt (condition: 85)
- Silver Arrow (condition: 90)
- Golden Spirit (condition: 75)
- Dark Storm (condition: 80)
- Wild Fire (condition: 88)

## ⚙️ Configuration

Cypress configuration is defined in `cypress.config.ts` at the project root:

| Setting | Value |
|---------|-------|
| **Base URL** | `http://localhost:5173` |
| **Spec Pattern** | `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}` |
| **Support File** | `cypress/e2e/support/e2e.ts` |
| **Fixtures Folder** | `cypress/e2e/fixtures` |
| **Viewport** | 1920×1080 |
| **Video Recording** | Disabled |
| **Screenshot on Failure** | Enabled |

## 🎯 Test Selectors

The application uses `data-testid` attributes for reliable element selection:

### Dashboard Elements
- `race-dashboard` - Main dashboard container
- `horse-list` - Horse list container
- `horse-item` - Individual horse in list
- `horse-name` - Horse name display
- `horse-condition` - Horse condition display

### Race Elements
- `race-track` - Race track container
- `horse-silhouette` - Horse visual representation
- `horse-wrapper` - Horse position wrapper
- `race-horse-item` - Horse in race lineup
- `race-horse-name` - Racing horse name

### Results Elements
- `results-horse-item` - Horse in results table
- `results-{round}-horse-item` - Horse in specific round results
- `round-{round}-results` - Results container for specific round

## 📝 Best Practices

1. **Use Custom Commands**: Leverage custom commands for common actions to keep tests DRY
2. **Data Test IDs**: Always use `data-testid` attributes instead of CSS classes or IDs
3. **Async Waits**: Use `await` with `cy.waitForRoundCompletion()` for proper timing
4. **Assertions**: Use explicit assertions (`.should()`) rather than implicit waits
5. **Isolation**: Each test should be independent and not rely on previous test state

## 🐛 Debugging

### Failed Tests
- Screenshots are automatically saved to `cypress/e2e/screenshots/`
- Check console logs in Cypress Test Runner
- Use `.debug()` command to pause test execution

### Common Issues

**Race timing issues:**
- Ensure wait times in `waitForRoundCompletion()` match actual race duration
- Current formula: `countdownTime + (round × 1000 + 8000)` ms

**Element not found:**
- Verify `data-testid` attributes exist in components
- Check if element is visible before interaction
- Use `cy.get('[data-testid="..."]', { timeout: 10000 })` for longer waits

**Flaky tests:**
- Add explicit waits for animations
- Use `.should('be.visible')` before interactions
- Increase timeout for slow operations

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands Guide](https://docs.cypress.io/api/cypress-api/custom-commands)

## 🔄 Continuous Integration

For CI/CD pipelines, use headless mode:

```bash
# Run all tests in headless mode
npm run cypress:run

# Generate reports
npx cypress run --reporter mochawesome
```

---

**Last Updated:** February 2026  
**Cypress Version:** Latest (check `package.json`)
