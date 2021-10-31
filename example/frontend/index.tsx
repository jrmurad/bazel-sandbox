import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "../common/frontend/ErrorBoundary";

const NameGenerator = React.lazy(
  () => import("unity/example/name_generator/frontend/NameGenerator")
);

ReactDOM.render(
  <div>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <NameGenerator />
      </Suspense>
    </ErrorBoundary>
  </div>,
  document.getElementById("root")
);
