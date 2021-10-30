import { protobufPackage } from "unity/example/name_generator/proto/v1/name_generator_service";
import { bootstrap } from "./common.helpers";
import { AppModule } from "./name_generator.app";

bootstrap(AppModule, protobufPackage, "NameGenerator", 9091);
