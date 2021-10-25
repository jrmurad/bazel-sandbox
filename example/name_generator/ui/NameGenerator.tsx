import React, { useCallback, useState } from "react";
import { GetRandomNameRequest } from "unity/example/name_generator/proto/v1/web_lib_pb/example/name_generator/proto/v1/name_generator_pb";
import { NameGeneratorServiceClient } from "unity/example/name_generator/proto/v1/web_lib_pb/example/name_generator/proto/v1/name_generator_service_grpc_web_pb";

export const NameGenerator: React.FC = () => {
  const [name, setName] = useState<string | undefined>();

  const generateNewName = useCallback(() => {
    const nameGeneratorService = new NameGeneratorServiceClient(
      "https://127.0.0.1:8443"
    );

    const request = new GetRandomNameRequest();

    nameGeneratorService.getRandomName(request, {}, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }

      setName(response.getName().getFirstName());
    });
  }, []);

  return (
    <>
      <button onClick={generateNewName}>Generate New Name</button>

      <div>{name}</div>
    </>
  );
};
