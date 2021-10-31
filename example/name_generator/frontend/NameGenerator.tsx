import React, { useCallback, useContext, useEffect, useState } from "react";
import { tap } from "rxjs";
import { RpcContext } from "unity/example/common/frontend/RpcContext";
import { NameGeneratorClientImpl } from "unity/example/name_generator/proto/v1/name_generator_service_web";

export const NameGenerator: React.FC = () => {
  const rpc = useContext(RpcContext);
  const nameGenerator = new NameGeneratorClientImpl(rpc);

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
