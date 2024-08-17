module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs|cjs)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(@?supabase)/)'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'app/**/*.{js,ts,jsx,tsx}',
    'pages/**/*.{js,ts,jsx,tsx}',
    'components/**/*.{js,ts,jsx,tsx}',
    'utils/**/*.{js,ts}',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};