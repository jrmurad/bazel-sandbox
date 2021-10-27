module.exports = {
  moduleNameMapper: {
    "^unity/(.*)": "<rootDir>/$1",
    // "^unity/(.*)": "<rootDir>/bazel-out/k8-fastbuild/bin/$1",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
  },
};
