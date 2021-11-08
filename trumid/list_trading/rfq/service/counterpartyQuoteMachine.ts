import { createMachine, sendParent } from "xstate";

type CounterpartyQuoteEvent =
  | { type: "ACCEPT" }
  | { type: "COUNTER" }
  | { type: "END" }
  | { type: "QUOTE" }
  | { type: "SEND" };

export interface CounterpartyQuoteContext {
  counterpartyId: string;
}

export const createCounterpartyQuoteMachine = (
  context: Pick<CounterpartyQuoteContext, "counterpartyId">
) =>
  createMachine<CounterpartyQuoteContext, CounterpartyQuoteEvent>({
    context,
    initial: "drafting",
    states: {
      accepted: { type: "final" },
      awaiting: {
        on: {
          END: { target: "ended" },
          QUOTE: { target: "quoted" },
        },
      },
      countered: {
        on: {
          COUNTER: { target: "countered" },
          END: { target: "ended" },
          QUOTE: { target: "quoted" },
        },
      },
      drafting: {
        on: {
          SEND: { target: "awaiting" },
        },
      },
      ended: {
        entry: sendParent({ type: "COUNTERPARTY.END" }),
        type: "final",
      },
      quoted: {
        on: {
          ACCEPT: { target: "accepted" },
          COUNTER: { target: "countered" },
          END: { target: "ended" },
          QUOTE: { target: "quoted" },
        },
      },
    },
  });
