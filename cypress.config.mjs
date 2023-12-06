import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/commands.js",
    screenshotOnRunFailure: false,
    specPattern: "cypress/tests/*.js"
  }
});
