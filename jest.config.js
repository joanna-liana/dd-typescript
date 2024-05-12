export default {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/test/.*\\.(test|spec))\\.ts?$',
  testEnvironment: 'node',
  rootDir: '.',
  collectCoverageFrom: ['**/*.ts', '!demo.ts'],
};
