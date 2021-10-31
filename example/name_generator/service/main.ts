import * as grpc from "@grpc/grpc-js";
import faker from "faker";
import { map, tap, timer } from "rxjs";
import { Name, Title } from "unity/example/common/proto/naming/v1/naming";
import {
  NameGeneratorServer,
  NameGeneratorService,
} from "unity/example/name_generator/proto/v1/name_generator_service";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ port: { type: "number" } })
  .parseSync();

const server = new grpc.Server();

function generateRandomName(): Name {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    title: Title.TITLE_DR, // JRM FIXME patch proto2 optional
  };
}

server.addService(NameGeneratorService, {
  getRandomName: (call, callback) => {
    callback(null, { name: generateRandomName() });
  },

  // @ts-ignore // JRM FIXME why do I need explicit types?
  streamRandomNames: (call, callback) => {
    timer(0, 1000)
      .pipe(
        map(generateRandomName),
        tap((name) => call.write({ name }))
      )
      .subscribe();
  },
} as NameGeneratorServer);

server.bindAsync(
  `127.0.0.1:${argv.port}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
