import React, { useCallback, useContext, useEffect, useState } from "react";
import { RpcContext } from "unity/example/common/frontend/RpcContext";
import { NameGeneratorClientImpl } from "unity/example/name_generator/proto/v1/name_generator_service_web";

export const NameGenerator: React.FC = () => {
  const rpc = useContext(RpcContext);
  const nameGenerator = new NameGeneratorClientImpl(rpc);

  const [streamedNames, setStreamedNames] = useState<string[]>([]);
  const [unaryName, setUnaryName] = useState<string | undefined>();

  const getRandomName = useCallback(async () => {
    try {
      const { name } = await nameGenerator.GetRandomName({});
      setUnaryName(name.firstName);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, []);

  useEffect(() => {
    nameGenerator.StreamRandomNames({}).subscribe(({ name: { firstName } }) => {
      setStreamedNames((prevState) => [firstName, ...prevState]);
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <button onClick={getRandomName}>Generate New Name</button>

        <div>{unaryName}</div>
      </div>

      <textarea readOnly rows={10} value={streamedNames.join("\n")} />
    </>
  );
};

export default NameGenerator;
