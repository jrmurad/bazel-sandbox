module.exports = {
  moduleNameMapper: {
    "^unity/(.*)": "<rootDir>/$1",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
  },
};
