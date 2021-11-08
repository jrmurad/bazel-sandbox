import { createMachine } from "xstate";

type CounterpartyQuoteEvent =
  | { type: "ACCEPT" }
  | { type: "COUNTER" }
  | { type: "END" }
  | { type: "QUOTE" };

export interface CounterpartyQuoteContext {
  counterpartyId: string;
}

export const createCounterpartyQuoteMachine = (
  context: Pick<CounterpartyQuoteContext, "counterpartyId">
) =>
  createMachine<CounterpartyQuoteContext, CounterpartyQuoteEvent>({
    context,
    initial: "awaiting",
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
      ended: { type: "final" },
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
