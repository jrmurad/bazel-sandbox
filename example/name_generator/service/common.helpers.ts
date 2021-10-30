import { DynamicModule } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  ClientOptions,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from "@nestjs/microservices";
import snakeCase from "lodash/snakeCase";
import { join } from "path";

export async function bootstrap(
  module: unknown,
  packageName: string,
  serviceName: string,
  port: number
): Promise<unknown> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    module,
    getGrpcOptions(packageName, serviceName, port)
  );

  return app.listen();
}

export function getGrpcOptions(
  packageName: string,
  serviceName: string,
  port: number
): ClientOptions {
  const root = process
    .cwd()
    .replace(/(.*?(darwin|k8)-fastbuild\/bin).*/i, "$1");
  const protoPath = join(
    root,
    packageName.replace(/\./g, "/"),
    `${snakeCase(serviceName)}.proto`
  );

  return {
    options: {
      loader: { includeDirs: [root] },
      package: packageName,
      protoPath,
      url: `0.0.0.0:${port}`,
    },
    transport: Transport.GRPC,
  };
}

export function registerClientsModule(
  packageName: string,
  serviceName: string,
  port: number
): DynamicModule {
  return ClientsModule.register([
    {
      name: packageName,
      ...getGrpcOptions(packageName, serviceName, port),
    },
  ]);
}
