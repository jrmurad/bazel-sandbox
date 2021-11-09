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
import path from "path";
import { createConnection, getMongoManager } from "typeorm";
import {
  RfqServer,
  RfqService,
} from "unity/trumid/list_trading/rfq/proto/v1/rfq_service";
import { Rfq } from "./entity/rfq.entity";

(async function () {
  await createConnection({
    database: "rfq",
    entities: [path.join(__dirname, "/entity/*.{js,ts}")],
    // host: "localhost",
    // port: 27017,
    type: "mongodb",
  });

  const server = new grpc.Server();

  server.addService(RfqService, {
    createDraft: async (call, callback) => {
      const rfq = await getMongoManager().save(new Rfq());
      callback(null, { id: rfq.id.toString() });
    },
  } as RfqServer);

  server.bindAsync(
    "127.0.0.1:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
})();
