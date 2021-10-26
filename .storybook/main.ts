const path = require("path");

module.exports = {
  addons: ["@storybook/addon-essentials", "@storybook/addon-storyshots"],
  stories: ["../example/**/*.stories.@(js|jsx|ts|tsx)"],
};
