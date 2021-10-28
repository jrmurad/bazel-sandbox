module.exports = {
  moduleNameMapper: {
    "^unity/(.*)": `${process.env.RUNFILES}/unity/$1`,
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
  },
};
