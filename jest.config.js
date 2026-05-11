const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const customConfig = {
  testEnvironment: "node",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  setupFilesAfterFramework: [],
};

module.exports = createJestConfig(customConfig);
