const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  addons: ["@storybook/addon-essentials", "@storybook/addon-storyshots"],
  stories: ["../example/**/*.stories.@(js|jsx|ts|tsx)"],
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      new TsconfigPathsPlugin({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
    ];

    return config;
  },
};
