module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
  testTimeout: 30000,
  coverageReporters: ["text-summary", "html"],
  coverageDirectory: "<rootDir>/testReport/"
};
