const nextJest = require('next/jest');

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: [ '<rootDir>/jest.setup.js' ],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
module.exports = createJestConfig(customJestConfig);

// module.exports = {
//   collectCoverageFrom: [
//     '**/*.{js,jsx,ts,tsx}',
//     '!**/*.d.ts',
//     '!**/node_modules/**',
//   ],
//   moduleNameMapper: {
//     // Handle CSS imports (with CSS modules)
//     // https://jestjs.io/docs/webpack#mocking-css-modules
//     '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

//     // Handle CSS imports (without CSS modules)
//     '^.+\\.(css|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',

//     // Handle image imports
//     // https://jestjs.io/docs/webpack#handling-static-assets
//     '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',

//     // Handle module aliases
//     '^@/components/(.*)$': '<rootDir>/src/components/$1',
//   },
//   setupFilesAfterEnv: [ '<rootDir>/jest.setup.js' ],
//   testPathIgnorePatterns: [ '<rootDir>/node_modules/', '<rootDir>/.next/' ],
//   transform: {
//     // Use babel-jest to transpile tests with the next/babel preset
//     // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
//     '^.+\\.(js|jsx|ts|tsx)$': [ 'babel-jest', { presets: [ 'next/babel' ] } ],
//   },
//   transformIgnorePatterns: [
//     '/node_modules/',
//     '^.+\\.module\\.(css|sass|scss)$',
//   ],
// };
