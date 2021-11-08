import {
  actions,
  ActorRefFrom,
  assign,
  createMachine,
  send,
  sendParent,
  spawn,
} from "xstate";
import {
  CounterpartyQuoteContext,
  createCounterpartyQuoteMachine,
} from "./counterpartyQuoteMachine";

type ADD_COUNTERPARTY_EVENT = {
  counterpartyQuote: CounterpartyQuoteContext;
  type: "COUNTERPARTY.ADD";
};

type END_COUNTERPARTY_EVENT = {
  counterpartyQuote: CounterpartyQuoteContext;
  type: "COUNTERPARTY.END";
};

type LineItemEvent =
  | { type: "ADD" }
  | { type: "END" }
  | { type: "SEND" }
  | { type: "TRADE" }
  | ADD_COUNTERPARTY_EVENT
  | END_COUNTERPARTY_EVENT;

export interface LineItemContext {
  counterpartyQuotes: {
    counterpartyQuote: CounterpartyQuoteContext;
    ref: ActorRefFrom<ReturnType<typeof createCounterpartyQuoteMachine>>;
  }[];
  instrumentId: string;
}

function addNewCounterparty(
  context: LineItemContext,
  { counterpartyQuote }: ADD_COUNTERPARTY_EVENT
): LineItemContext["counterpartyQuotes"] {
  const { counterpartyId } = counterpartyQuote;

  return [
    ...context.counterpartyQuotes,
    {
      counterpartyQuote,
      ref: spawn(
        createCounterpartyQuoteMachine({ counterpartyId }),
        `counterparty-${counterpartyId}`
      ),
    },
  ];
}

const endWhenAllCounterpartiesEnded = actions.choose<
  LineItemContext,
  END_COUNTERPARTY_EVENT
>([
  {
    actions: send("END"),
    cond: ({ counterpartyQuotes }) =>
      counterpartyQuotes.every(({ ref }) => ref.getSnapshot()?.done),
  },
]);

export const createLineItemMachine = (
  context: Pick<LineItemContext, "instrumentId">
) =>
  createMachine<LineItemContext, LineItemEvent>({
    context: { ...context, counterpartyQuotes: [] },
    initial: "drafting",
    states: {
      drafting: {
        on: {
          "COUNTERPARTY.ADD": {
            // actions: assign({ counterpartyQuotes: addNewCounterparty}),
            actions: assign({
              // https://xstate.js.org/docs/guides/typescript.html#assign-action-behaving-strangely
              counterpartyQuotes: (context, event) =>
                addNewCounterparty(context, event),
            }),
          },
          SEND: {
            actions: ({ counterpartyQuotes }) => {
              counterpartyQuotes.forEach(({ ref }) =>
                ref.send({ type: "SEND" })
              );
            },
            target: "quoting",
          },
        },
      },
      ended: {
        entry: sendParent({ type: "LINE_ITEM.END" }),
        type: "final",
      },
      quoting: {
        on: {
          "COUNTERPARTY.END": {
            actions: endWhenAllCounterpartiesEnded,
          },
          END: { target: "ended" },
        },
      },
    },
  });
