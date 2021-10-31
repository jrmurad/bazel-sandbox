import React, { useCallback, useEffect, useState } from "react";
import { tap } from "rxjs";
import {
  GrpcWebImpl,
  NameGeneratorClientImpl,
} from "unity/example/name_generator/proto/v1/name_generator_service_web";

// JRM FIXME sharable context
const rpc = new GrpcWebImpl("https://127.0.0.1:8443", {});
const nameGenerator = new NameGeneratorClientImpl(rpc);

export const NameGenerator: React.FC = () => {
  const [name, setName] = useState<string | undefined>();

  const generateNewName = useCallback(async () => {
    try {
      const ret = await nameGenerator.GetRandomName({});
      setName(ret.name?.firstName);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    nameGenerator
      .StreamRandomNames({})
      .pipe(tap(({ name }) => console.log(name?.firstName)))
      .subscribe();
  }, []);

  return (
    <>
      <button onClick={generateNewName}>Generate New Name</button>

      <div>{name}</div>
    </>
  );
};

export default NameGenerator;
