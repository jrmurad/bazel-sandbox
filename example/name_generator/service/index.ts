import * as grpc from "@grpc/grpc-js";
import faker from "faker";
import { Name } from "unity/example/name_generator/proto/v1/js_lib_pb/example/common/naming/proto/v1/naming_pb";
import { GetRandomNameResponse } from "unity/example/name_generator/proto/v1/js_lib_pb/example/name_generator/proto/v1/name_generator_pb";
import {
  INameGeneratorServiceServer,
  NameGeneratorServiceService,
} from "unity/example/name_generator/proto/v1/js_lib_pb/example/name_generator/proto/v1/name_generator_service_grpc_pb";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({
    port: { type: "number" },
  })
  .parseSync();

const server = new grpc.Server();

server.addService(NameGeneratorServiceService, {
  getRandomName: (call, callback) => {
    const response = new GetRandomNameResponse();

    const name = new Name();
    name.setFirstName(faker.name.firstName());
    name.setLastName(faker.name.lastName());

    response.setName(name);

    callback(null, response);
  },
} as INameGeneratorServiceServer);

server.bindAsync(
  `127.0.0.1:${argv.port}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
