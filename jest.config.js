/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  testMatch: ["<rootDir>/__tests__/tests/**/*.test.ts"],
  reporters: [
    "default" // Use Jest's default reporter
    // Optionally, if a custom reporter that displays ticks exists, add it here
    // Example: ['default', 'ticks-reporter']
  ],
  transform: {
    // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // ts-jest configuration goes here
      }
    ]
  }
};
