import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "unity/common/frontend/ErrorBoundary";
import { grpcWebImpl, RpcContext } from "unity/common/frontend/RpcContext";

const NameGenerator = React.lazy(
  () => import("unity/example/name_generator/frontend/NameGenerator")
);

ReactDOM.render(
  <div>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RpcContext.Provider value={grpcWebImpl}>
          <NameGenerator />
        </RpcContext.Provider>
      </Suspense>
    </ErrorBoundary>
  </div>,
  document.getElementById("root")
);
