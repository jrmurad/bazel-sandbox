// import { GetRandomNameRequest } from "unity/bazel-out/k8-fastbuild/bin/example/name_generator/v1/web_lib_pb/example/name_generator/v1/name_generator_pb";

import { NameGeneratorServiceClient } from "unity/example/name_generator/v1/web_lib_pb/example/name_generator/v1/name_generator_service_grpc_web_pb";

const nameGeneratorService = new NameGeneratorServiceClient('http://localhost:50051');

// const request = new GetRandomNameRequest();
// nameGeneratorService.getRandomName(request, {}, (err, response) => console.log(response));