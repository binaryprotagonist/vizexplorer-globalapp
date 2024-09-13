module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    ".(css|sass|scss)$": "identity-obj-proxy",
    "intl-tel-input/styles": "identity-obj-proxy",
    "generated-graphql": "<rootDir>/src/view/graphql/generated/graphql",
    "testing/(.*)": "<rootDir>/src/view/testing/$1",
    "view-v2/(.*)": "<rootDir>/src/view-v2/$1",
    // TODO: used by `@material-table/core` which is using `uuid` v8. `uuid` v9 shouldn't require this
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve("uuid")
  },
  setupFilesAfterEnv: ["./jest-setup.ts"],
  testEnvironment: "jsdom",
  testTimeout: 10000
};
