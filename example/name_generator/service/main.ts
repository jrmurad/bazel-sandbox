import * as grpc from "@grpc/grpc-js";
import faker from "faker";
import { Title } from "unity/example/common/naming/proto/v1/naming";
import {
  NameGeneratorServer,
  NameGeneratorService,
} from "unity/example/name_generator/proto/v1/name_generator_service";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ port: { type: "number" } })
  .parseSync();

const server = new grpc.Server();

server.addService(NameGeneratorService, {
  getRandomName: (call, callback) => {
    callback(null, {
      name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        title: Title.TITLE_DR, // JRM FIXME patch proto2 optional
      },
    });
  },
} as NameGeneratorServer);

server.bindAsync(
  `127.0.0.1:${argv.port}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
