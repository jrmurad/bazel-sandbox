/* eslint-disable @typescript-eslint/no-var-requires */

const React = require("react");
const { grpcWebImpl, RpcContext } = require("../common/frontend/RpcContext");

module.exports = {
  decorators: [
    (Story) =>
      React.createElement(
        RpcContext.Provider,
        { value: grpcWebImpl },
        React.createElement(Story, null)
      ),
  ],
};
