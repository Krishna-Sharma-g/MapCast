export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testTimeout: 30000,
};
