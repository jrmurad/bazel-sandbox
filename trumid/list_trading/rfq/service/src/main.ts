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
import { MongoClient, MongoError, ObjectId } from "mongodb";
import { State } from "unity/trumid/list_trading/rfq/proto/v1/rfq";
import {
  RfqServer,
  RfqService,
} from "unity/trumid/list_trading/rfq/proto/v1/rfq_service";

interface Rfq {
  state: State;
}

// JRM TODO move to common
function handleError<T>(callback: grpc.sendUnaryData<T>, err: unknown) {
  if (err instanceof MongoError) {
    callback({ message: err.message, name: err.name });
  } else {
    console.error(err);
  }
}

(async function () {
  const client = await new MongoClient("mongodb://localhost", {
    directConnection: true,
    replicaSet: "rs0",
  }).connect();

  const rfqs = client.db("rfq").collection<Rfq>("rfqs");

  const server = new grpc.Server();

  server.addService(RfqService, {
    createDraft: async (call, callback) => {
      try {
        const rfq = await rfqs.insertOne({ state: State.STATE_DRAFT });
        callback(null, { id: rfq.insertedId.toString() });
      } catch (err) {
        handleError(callback, err);
      }
    },

    end: async (call, callback) => {
      try {
        await rfqs.deleteOne({ _id: new ObjectId(call.request.id) });
        callback(null);
      } catch (err) {
        handleError(callback, err);
      }
    },

    stream: (call) => {
      const cursor = rfqs.watch();

      call.on("cancelled", () => {
        cursor.close();
      });

      cursor.on("change", ({ documentKey, operationType }) => {
        const id = (documentKey as unknown as { _id: ObjectId })._id.toString();

        switch (operationType) {
          case "delete":
            call.write({ id, state: State.STATE_ENDED });
            break;

          case "insert":
            call.write({ id, state: State.STATE_DRAFT });
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
