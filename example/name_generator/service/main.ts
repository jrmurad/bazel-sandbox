import { bootstrap } from "unity/common/helpers";
import { EXAMPLE_NAME_GENERATOR_PROTO_V1_PACKAGE_NAME } from "unity/example/name_generator/proto/v1/name_generator_service";
import yargs from "yargs/yargs";
import { AppModule } from "./name_generator.app";

const argv = yargs(process.argv.slice(2))
  .options({ port: { default: 5000, type: "number" } })
  .parseSync();

bootstrap(
  AppModule,
  EXAMPLE_NAME_GENERATOR_PROTO_V1_PACKAGE_NAME,
  "NameGeneratorService",
  argv.port
);
