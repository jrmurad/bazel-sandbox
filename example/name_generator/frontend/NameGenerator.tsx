import React, { useCallback, useState } from "react";
import {
  GrpcWebImpl,
  NameGeneratorClientImpl,
} from "unity/example/name_generator/proto/v1/name_generator_service_web";

export const NameGenerator: React.FC = () => {
  const [name, setName] = useState<string | undefined>();

  const generateNewName = useCallback(async () => {
    const rpc = new GrpcWebImpl("https://127.0.0.1:8443", {});
    const nameGenerator = new NameGeneratorClientImpl(rpc);

    try {
      const ret = await nameGenerator.GetRandomName({});
      setName(ret.name?.firstName);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <button onClick={generateNewName}>Generate New Name</button>

      <div>{name}</div>
    </>
  );
};

export default NameGenerator;
