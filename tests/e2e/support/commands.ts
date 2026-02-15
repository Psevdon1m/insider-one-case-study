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
             * Custom command to wait for race to complete
             * @example cy.waitForRaceCompletion()
             */
            waitForRaceCompletion(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('visitRaceDashboard', () => {
    cy.visit('/');
});

Cypress.Commands.add('startRace', () => {
    // Adjust selector based on your actual button
    cy.contains('button', /start|race/i).click();
});

Cypress.Commands.add('waitForRaceCompletion', () => {
    // Wait for race to finish - adjust timeout as needed
    cy.get('[data-testid="race-results"]', { timeout: 30000 }).should('be.visible');
});

export { };
