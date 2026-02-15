// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit the race dashboard
       * @example cy.visitRaceDashboard()
       */
      visitRaceDashboard(): Chainable<void>;

      /**
       * Custom command to start a race
       * @example cy.startRace()
       */
      startRace(): Chainable<void>;
      /**
       * Custom command to generate a program
       * @example cy.generateProgram()
       */
      generateProgram(): Chainable<void>;

      /**
       * Custom command to wait for race to complete
       * @example cy.waitForRaceCompletion()
       */
      waitForRaceCompletion(): Chainable<void>;

      /**
       * Custom command to wait for race to complete
       * @example cy.waitForRaceCompletion()
       */
      waitForRoundCompletion(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("visitRaceDashboard", () => {
  cy.visit("/");
});

Cypress.Commands.add("startRace", () => {
  // Adjust selector based on your actual button
  cy.contains("button", /start/i).click();
});
Cypress.Commands.add("generateProgram", () => {
  // Adjust selector based on your actual button
  cy.contains("button", /generate program/i).click();
});

Cypress.Commands.add("waitForRaceCompletion", () => {
  // Wait for race to finish
  cy.get(`[data-testid="round-6-results"]`, { timeout: 120000 })
    .find(`[data-testid="results-6-horse-item"]`, { timeout: 120000 })
    .should("have.length", 10);
});
Cypress.Commands.add("waitForRoundCompletion", (round) => {
  // Wait time for this specific round:
  // - 4000ms countdown before the round starts (except for round 1)
  // - round * 1000ms + 8000 ms for the race itself
  const countdownTime = round > 1 ? 4000 : 0;
  const raceTime = round * 1000 + 9000;
  const totalWaitTime = countdownTime + raceTime;

  cy.wait(totalWaitTime);
  cy.get(`[data-testid="round-${round}-results"]`).should("exist");
});

export {};
