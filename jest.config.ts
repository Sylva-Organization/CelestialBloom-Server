/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import dotenv from 'dotenv';
import type { Config } from 'jest';
dotenv.config({ path: ".env.test" });

const config: Config = {
  // Preset para ESM
  preset: 'ts-jest/presets/default-esm',

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/database/",
    "/config/"
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // Extensions to treat as ESM
  extensionsToTreatAsEsm: ['.ts'],

  // Module file extensions
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // CRÍTICO: Module name mapper para resolver imports com .js
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>/tests"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Transform configuration para ESM
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
        },
      },
    ],
  },
};

export default config;