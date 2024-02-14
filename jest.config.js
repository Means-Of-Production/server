module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*d.ts"
    ],
    coveragePathIgnorePatterns: [
        "jest.config.js",
        "/node_modules/",
        "/dist/"
    ],
    testMatch: [ "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)" ]
};