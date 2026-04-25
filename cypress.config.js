const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.js',
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: 'cypress/support/component.js',
  },
});
