import {
  actions,
  ActorRefFrom,
  assign,
  createMachine,
  send,
  spawn,
} from "xstate";
import { createLineItemMachine, LineItemContext } from "./lineItemMachine";

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
  | { type: "SEND" }
  | ADD_LINE_ITEM_EVENT
  | END_LINE_ITEM_EVENT;

interface RfqContext {
  expiry?: number;
  lineItems: {
    lineItem: LineItemContext;
    ref: ActorRefFrom<ReturnType<typeof createLineItemMachine>>;
  }[];
}

function addNewLineItem(
  context: RfqContext,
  { lineItem }: ADD_LINE_ITEM_EVENT
) {
  const { instrumentId } = lineItem;

  return [
    ...context.lineItems,
    {
      lineItem,
      ref: spawn(
        createLineItemMachine({ instrumentId }),
        `lineItem-${instrumentId}`
      ),
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

export const createRfqMachine = (context: Partial<RfqContext>) =>
  createMachine<RfqContext, RfqEvent>({
    context: { ...context, lineItems: [] },
    initial: "drafting",
    states: {
      awaiting: {
        after: [
          {
            cond: ({ expiry }) => expiry !== undefined,
            delay: computeExpiryDelay,
            target: "ended",
          },
        ],
        on: {
          END: { target: "ended" },
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
            actions: ({ lineItems }) => {
              lineItems.forEach(({ ref }) => ref.send({ type: "SEND" }));
            },
            target: "awaiting",
          },
        },
      },
      ended: { type: "final" },
    },
  });
