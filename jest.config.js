module.exports = {
  moduleNameMapper: {
    "^unity/(.*)": process.env.RUNFILES
      ? `${process.env.RUNFILES}/unity/$1`
      : "<rootDir>/bazel-bin/$1",
  },
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
