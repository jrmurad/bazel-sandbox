import React from "react";
import { grpcWebImpl, RpcContext } from "../common/frontend/RpcContext";

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
