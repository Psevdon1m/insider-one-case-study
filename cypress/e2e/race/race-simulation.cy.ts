describe("Race Simulation E2E", () => {
  beforeEach(() => {
    // Visit the race dashboard before each test
    cy.visitRaceDashboard();
  });
  afterEach(() => {
    // Visit the race dashboard before each test
    cy.reload();
  });

  it.skip("all 6 rounds should complete automatically with results", () => {
    // this is needed to proprerly reset page after previous test

    cy.visitRaceDashboard();

    //generate program
    cy.generateProgram();

    //start a racce
    cy.startRace();

    // Wait for and verify each round sequentially via Cypress command chain (no async/await)
    const waitAndVerifyRound = (round: number) => {
      if (round > 6) return;
      cy.waitForRoundCompletion(round);
      cy.get(`[data-testid="round-${round}-results"]`).should("exist");
      cy.get(`[data-testid="round-${round}-results"]`)
        .find(`[data-testid="results-${round}-horse-item"]`)
        .should("have.length", 10)
        .then(() => waitAndVerifyRound(round + 1));
    };
    waitAndVerifyRound(1);
  });
  it("should load the race dashboard successfully", () => {
    // Verify the page loads
    cy.get('[data-testid="race-dashboard"]').should("exist");

    // Verify horses are displayed
    cy.get('[data-testid="horse-list"]').should("exist");
  });

  it("should display all horses before race starts", () => {
    // Check that horses are rendered
    cy.get('[data-testid="horse-item"]').then((el) =>
      expect(el.length).to.equal(20),
    );

    // Verify horse details are visible (name, condition)
    cy.get('[data-testid="horse-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="horse-name"]').should("be.visible");
        cy.get('[data-testid="horse-condition"]').should("be.visible");
      });
  });

  it("should generate program when generate program button is clicked", () => {
    // Click the start race button
    cy.generateProgram();

    // Verify  that horses silhouettes are on the race track
    cy.get('[data-testid="horse-silhouette"]').should("be.visible");

    // Verify horses are displayed
    cy.get('[data-testid="race-horse-item"]').then(
      (el) => expect(el.length).to.equal(60), // 10 per race
    );

    // Verify that reace horses are picked
    cy.get('[data-testid="race-horse-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="race-horse-name"]').should("exist");
      });
  });

  it("should start a race when start button is clicked", () => {
    // Click the start race button
    cy.generateProgram();
    cy.startRace();

    // Verify race track is visible
    cy.get('[data-testid="race-track"]').should("be.visible");

    // Verify horses are moving (check for progress updates)
    cy.get('[data-testid="horse-wrapper"]').should(
      "have.length.greaterThan",
      0,
    );

    // Capture initial left position
    cy.get('[data-testid="horse-wrapper"]')
      .first()
      .invoke("css", "left")
      .then((initialLeft) => {
        // Wait for animation to progress
        cy.wait(1000);

        // Verify the left position has changed (horse is moving)
        cy.get('[data-testid="horse-wrapper"]')
          .first()
          .invoke("css", "left")
          .should("not.equal", initialLeft);
      });

    cy.visitRaceDashboard();
  });

  it("results table should be populated after 1 round", () => {
    // Start the race
    cy.generateProgram();
    cy.startRace();

    // Wait for race to complete
    cy.waitForRoundCompletion(1);

    // Verify all finishing positions for round 1 are shown
    cy.get(`[data-testid="results-1-horse-item"]`).then((el) =>
      expect(el.length).to.equal(10),
    );
    cy.visitRaceDashboard();
  });

  //skipped in ci due to long running
  it.skip("should allow starting a new race after completion", () => {
    // Complete first race
    cy.generateProgram();
    cy.startRace();
    cy.waitForRaceCompletion();

    // Look for "New Race" or "Race Again" button
    cy.contains("button", /generate program/i).should("be.enabled");

    cy.contains("button", /start/i).should("be.enabled");
    cy.contains("button", /generate program/i).click();

    // Verify racing horses are displayed in program
    cy.get('[data-testid="race-horse-item"]').then(
      (el) => expect(el.length).to.equal(60), // 10 per race
    );
  });
});
