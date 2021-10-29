module.exports = {
  moduleNameMapper: {
    "^unity/(.*)": `${process.env.RUNFILES}/unity/$1`,
  },
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
