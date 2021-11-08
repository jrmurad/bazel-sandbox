// import { interpret } from "xstate";
// import { createRfqMachine } from "./rfqMachine";

// const rfqMachine = createRfqMachine({
//   expiry: Date.now() + 3000,
//   lineItems: [],
// });

// const rfqService = interpret(rfqMachine)
//   .onDone(() => console.log("done!"))
//   .start();

// // rfqService.send({ type: "CANCEL" });
// rfqService.send({
//   lineItem: { counterpartyQuotes: [], instrumentId: "123" },
//   type: "LINE_ITEM.ADD",
// });
// rfqService.send({
//   lineItem: { counterpartyQuotes: [], instrumentId: "456" },
//   type: "LINE_ITEM.ADD",
// });

// rfqService.send({ type: "SEND" });

// // rfqService.state.context.lineItems[0].ref.send({ type: "END" });
// rfqService.state.context.lineItems[1].ref.send({ type: "END" });
// // console.log(rfqService.state.context);
// console.log(rfqService.state.value);

import * as grpc from "@grpc/grpc-js";
import {
  RfqServer,
  RfqService,
} from "unity/trumid/list_trading/rfq/proto/v1/rfq_service";

const server = new grpc.Server();

server.addService(RfqService, {
  createDraft: (call, callback) => {
    const id = "123";
    callback(null, { id });
  },
} as RfqServer);

server.bindAsync(
  "127.0.0.1:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
