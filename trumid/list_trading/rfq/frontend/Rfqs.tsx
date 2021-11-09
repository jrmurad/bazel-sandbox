import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RpcContext } from "unity/common/frontend/RpcContext";
import { State } from "unity/trumid/list_trading/rfq/proto/v1/rfq";
import { RfqClientImpl } from "unity/trumid/list_trading/rfq/proto/v1/rfq_service_web";

export const Rfqs: React.FC = () => {
  const rpc = useContext(RpcContext);
  const rfqClient = useMemo(() => new RfqClientImpl(rpc), [rpc]);

  const [streamed, setStreamed] = useState<string[]>([]);

  const draftRfq = useCallback(async () => {
    try {
      await rfqClient.CreateDraft({});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, []);

  useEffect(() => {
    rfqClient.Stream({}).subscribe((rfq) => {
      setStreamed((prevState) =>
        rfq.state === State.STATE_ENDED
          ? prevState.filter((id) => id !== rfq.id)
          : [rfq.id, ...prevState]
      );
    });
  }, []);

  return (
    <>
      <div>
        <button onClick={draftRfq}>New RFQ</button>
      </div>

      <ul>
        {streamed.map((id) => (
          <li key={id} onClick={() => rfqClient.End({ id })}>
            {id}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Rfqs;
