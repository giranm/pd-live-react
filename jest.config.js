module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./cypress/'],
  setupFiles: ['dotenv/config', 'jest-canvas-mock'],
  setupFilesAfterEnv: ['./setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};
