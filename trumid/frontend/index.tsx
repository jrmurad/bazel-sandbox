import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "unity/common/frontend/ErrorBoundary";
import { grpcWebImpl, RpcContext } from "unity/common/frontend/RpcContext";

const Rfqs = React.lazy(
  () => import("unity/trumid/list_trading/rfq/frontend/Rfqs")
);

ReactDOM.render(
  <div>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RpcContext.Provider value={grpcWebImpl}>
          <Rfqs />
        </RpcContext.Provider>
      </Suspense>
    </ErrorBoundary>
  </div>,
  document.getElementById("root")
);
