import { Module } from "@nestjs/common";
import { NameGeneratorController } from "./name_generator.controller";

@Module({ controllers: [NameGeneratorController] })
class NameGeneratorModule {}

@Module({ imports: [NameGeneratorModule] })
export class AppModule {}
