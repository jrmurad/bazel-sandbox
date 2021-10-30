import { EXAMPLE_NAME_GENERATOR_PROTO_V1_PACKAGE_NAME } from "unity/example/name_generator/proto/v1/name_generator_service";
import { bootstrap } from "./common.helpers";
import { AppModule } from "./name_generator.app";

bootstrap(
  AppModule,
  EXAMPLE_NAME_GENERATOR_PROTO_V1_PACKAGE_NAME,
  "NameGeneratorService",
  9091
);
