import { GetRandomNameRequest } from "unity/example/name_generator/proto/v1/web_lib_pb/example/name_generator/proto/v1/name_generator_pb";

import { NameGeneratorServiceClient } from "unity/example/name_generator/proto/v1/web_lib_pb/example/name_generator/proto/v1/name_generator_service_grpc_web_pb";

const nameGeneratorService = new NameGeneratorServiceClient(
  "http://localhost:50051"
);

const request = new GetRandomNameRequest();
nameGeneratorService.getRandomName(request, {}, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(response);
});
