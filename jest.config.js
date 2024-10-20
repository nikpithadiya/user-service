module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test)'], // Match .spec.ts and .test.ts files
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json', // Ensure this matches your tsconfig file
      },
    },
  };
  