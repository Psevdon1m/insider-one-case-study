import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/insider-one-case-study/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/e2e/support/e2e.ts",
    fixturesFolder: "cypress/e2e/fixtures",
    screenshotsFolder: "cypress/e2e/screenshots",
    videosFolder: "cypress/e2e/videos",
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: true,
  },
});
