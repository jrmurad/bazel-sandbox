import * as grpc from "@grpc/grpc-js";
import faker from "faker";
import { fromEvent, map, takeUntil, timer } from "rxjs";
import { Name, Title } from "unity/example/common/proto/naming/v1/naming";
import {
  NameGeneratorServer,
  NameGeneratorService,
} from "unity/example/name_generator/proto/v1/name_generator_service";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ port: { type: "number" } })
  .parseSync();

function generateRandomName(): Name {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    title: Title.TITLE_DR, // JRM FIXME patch proto2 optional
  };
}

const server = new grpc.Server();

server.addService(NameGeneratorService, {
  getRandomName: (call, callback) => {
    callback(null, { name: generateRandomName() });
  },

  streamRandomNames: (call) => {
    timer(0, 1000)
      .pipe(takeUntil(fromEvent(call, "cancelled")), map(generateRandomName))
      .subscribe((name) => {
        call.write({ name });
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
