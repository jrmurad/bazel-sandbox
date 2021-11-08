import { ActorRefFrom, assign, createMachine, sendParent, spawn } from "xstate";
import {
  CounterpartyQuoteContext,
  createCounterpartyQuoteMachine,
} from "./counterpartyQuoteMachine";

type ADD_COUNTERPARTY_EVENT = {
  counterpartyQuote: CounterpartyQuoteContext;
  type: "COUNTERPARTY.ADD";
};

type LineItemEvent =
  | { type: "ADD" }
  | ADD_COUNTERPARTY_EVENT
  | { type: "END" }
  | { type: "SEND" }
  | { type: "TRADE" };

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

export const createLineItemMachine = (
  context: Pick<LineItemContext, "instrumentId">
) =>
  createMachine<LineItemContext, LineItemEvent>({
    context: { ...context, counterpartyQuotes: [] },
    initial: "drafting",
    states: {
      awaiting: {
        on: {
          END: { target: "ended" },
        },
      },
      drafting: {
        on: {
          "COUNTERPARTY.ADD": {
            actions: assign({
              // https://xstate.js.org/docs/guides/typescript.html#assign-action-behaving-strangely
              counterpartyQuotes: (context, event) =>
                addNewCounterparty(context, event),
            }),
          },
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
