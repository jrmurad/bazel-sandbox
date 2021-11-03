import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "../common/frontend/ErrorBoundary";
import { grpcWebImpl, RpcContext } from "../common/frontend/RpcContext";
import NameGenerator from "../name_generator/frontend/NameGenerator";

// const NameGenerator = React.lazy(
//   () => import("unity/example/name_generator/frontend/NameGenerator")
// );

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
