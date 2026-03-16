/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app', '<rootDir>/components', '<rootDir>/lib'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/api/health/route.ts',
    'app/api/languages/route.ts',
    'app/api/explain/route.ts',
    'lib/server/api/**/*.ts',
    'lib/server/ai/llm.ts',
    'lib/server/db/mongoose.ts',
    'lib/server/db/services/search-history.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
