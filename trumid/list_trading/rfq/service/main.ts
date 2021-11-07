import {
  actions,
  ActorRefFrom,
  assign,
  createMachine,
  interpret,
  send,
  sendParent,
  spawn,
} from "xstate";

type ADD_LINE_ITEM_EVENT = {
  lineItem: LineItemContext;
  type: "LINE_ITEM.ADD";
};

type END_LINE_ITEM_EVENT = {
  lineItem: LineItemContext;
  type: "LINE_ITEM.END";
};

type RfqEvent =
  | { type: "END" }
  | { type: "EXPIRE" }
  | ADD_LINE_ITEM_EVENT
  | END_LINE_ITEM_EVENT
  | { type: "SEND" };

interface RfqContext {
  expiry?: number;
  lineItems: {
    lineItem: LineItemContext;
    ref: ActorRefFrom<typeof lineItemMachine>;
  }[];
}

function addNewLineItem(context: RfqContext, event: ADD_LINE_ITEM_EVENT) {
  return [
    ...context.lineItems,
    {
      lineItem: event.lineItem,
      ref: spawn(lineItemMachine, `lineItem-${event.lineItem.instrumentId}`),
    },
  ];
}

function computeExpiryDelay({ expiry }: RfqContext) {
  const now = Date.now();

  if (expiry === undefined) {
    return -1; // cond guards this against being used
  }

  if (expiry < now) {
    return 0;
  }

  return expiry - now;
}

const createRfqMachine = (context: {
  expiry?: number;
  lineItems: RfqContext["lineItems"];
}) => {
  return createMachine<RfqContext, RfqEvent>({
    context,
    initial: "drafting",
    states: {
      awaiting: {
        after: [
          {
            cond: ({ expiry }) => expiry !== undefined,
            delay: computeExpiryDelay,
            target: "expired",
          },
        ],
        on: {
          END: { target: "ended" },
          EXPIRE: { target: "expired" },
          "LINE_ITEM.END": {
            actions: actions.choose([
              {
                actions: send("END"),
                cond: ({ lineItems }) =>
                  lineItems.every(({ ref }) => ref.getSnapshot()?.done),
              },
            ]),
          },
        },
      },
      drafting: {
        on: {
          "LINE_ITEM.ADD": {
            actions: assign({ lineItems: addNewLineItem }),
          },
          SEND: {
            actions: [
              (context) => {
                context.lineItems.forEach((lineItem) =>
                  lineItem.ref.send({ type: "SEND" })
                );
              },
            ],
            target: "awaiting",
          },
        },
      },
      ended: { type: "final" },
      expired: { type: "final" },
    },
  });
};

type LineItemEvent =
  | { type: "ADD" }
  | { type: "END" }
  | { type: "SEND" }
  | { type: "TRADE" };

interface LineItemContext {
  instrumentId: string;
}

const lineItemMachine = createMachine<LineItemContext, LineItemEvent>({
  initial: "drafting",
  states: {
    awaiting: {
      on: {
        END: { target: "ended" },
      },
    },
    drafting: {
      on: {
        SEND: { target: "awaiting" },
      },
    },
    ended: {
      entry: sendParent({ type: "LINE_ITEM.END" }), // JRM FIXME parent event typechecking?
      type: "final",
    },
    quoted: {
      on: {
        END: { target: "ended" },
        TRADE: { target: "traded" },
      },
    },
    traded: { type: "final" },
  },
});

// type CounterpartyQuoteEvent =
//   | { type: "ACCEPT" }
//   | { type: "COUNTER" }
//   | { type: "END" }
//   | { type: "QUOTE" };

// interface CounterpartyQuoteContext {
//   counterpartyId: string;
// }

// const counterpartyQuoteMachine = createMachine<
//   CounterpartyQuoteContext,
//   CounterpartyQuoteEvent
// >({
//   initial: "awaiting",
//   states: {
//     accepted: { type: "final" },
//     awaiting: {
//       on: {
//         END: { target: "ended" },
//         QUOTE: { target: "quoted" },
//       },
//     },
//     countered: {
//       on: {
//         COUNTER: { target: "countered" },
//         END: { target: "ended" },
//         QUOTE: { target: "quoted" },
//       },
//     },
//     ended: { type: "final" },
//     quoted: {
//       on: {
//         ACCEPT: { target: "accepted" },
//         COUNTER: { target: "countered" },
//         END: { target: "ended" },
//         QUOTE: { target: "quoted" },
//       },
//     },
//   },
// });

const rfqMachine = createRfqMachine({
  expiry: Date.now() + 3000,
  lineItems: [],
});

const rfqService = interpret(rfqMachine)
  .onDone(() => console.log("done!"))
  .start();

// rfqService.send({ type: "CANCEL" });
rfqService.send({ lineItem: { instrumentId: "123" }, type: "LINE_ITEM.ADD" });
rfqService.send({ lineItem: { instrumentId: "456" }, type: "LINE_ITEM.ADD" });

rfqService.send({ type: "SEND" });

rfqService.state.context.lineItems[0].ref.send({ type: "END" });
rfqService.state.context.lineItems[1].ref.send({ type: "END" });
// console.log(rfqService.state.context);
console.log(rfqService.state.value);
