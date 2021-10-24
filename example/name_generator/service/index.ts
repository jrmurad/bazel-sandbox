import * as grpc from "@grpc/grpc-js";
import {
  Name,
  Title
} from "unity/example/name_generator/proto/v1/js_lib_pb/example/common/naming/proto/v1/naming_pb";
import { GetRandomNameResponse } from "unity/example/name_generator/proto/v1/js_lib_pb/example/name_generator/proto/v1/name_generator_pb";
import {
  INameGeneratorServiceServer,
  NameGeneratorServiceService
} from "unity/example/name_generator/proto/v1/js_lib_pb/example/name_generator/proto/v1/name_generator_service_grpc_pb";

const server = new grpc.Server();

server.addService(NameGeneratorServiceService, {
  getRandomName: (call, callback) => {
    const response = new GetRandomNameResponse();

    const name = new Name();
    name.setFirstName("First");
    name.setLastName("Last");
    name.setTitle(Title.TITLE_MR);

    response.setName(name);

    callback(null, response);
  },
} as INameGeneratorServiceServer);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
