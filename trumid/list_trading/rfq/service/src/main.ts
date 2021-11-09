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
import { MongoClient, ObjectId } from "mongodb";
import {
  RfqServer,
  RfqService,
} from "unity/trumid/list_trading/rfq/proto/v1/rfq_service";

interface Rfq {}

(async function () {
  const client = await new MongoClient("mongodb://localhost", {
    directConnection: true,
  }).connect();
  const db = client.db("rfq");
  const rfqs = db.collection<Rfq>("rfqs");

  rfqs.watch();

  const server = new grpc.Server();

  server.addService(RfqService, {
    createDraft: async (call, callback) => {
      const rfq = await rfqs.insertOne({});
      callback(null, { id: rfq.insertedId.toString() });
    },

    streamRfqs: (call) => {
      const cursor = rfqs.watch();

      call.on("cancelled", () => {
        cursor.close();
      });

      cursor.on("change", ({ documentKey, operationType }) => {
        const id = (documentKey as unknown as { _id: ObjectId })._id.toString();

        switch (operationType) {
          case "delete":
            call.write({ id, isDeleted: true });
            break;

          case "insert":
            call.write({ id });
            break;
        }
      });
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
