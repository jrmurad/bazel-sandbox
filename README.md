# Bazel Sandbox

## Usage

### Service

    bazel run //example/name_generator

    grpcurl -plaintext -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:50051 example.name_generator.proto.v1.NameGeneratorService/GetRandomName`

### Web

enable Chrome flag: #allow-insecure-localhost

    bazel run //:grpcwebproxy

    grpcurl -insecure -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:8443 example.name_generator.proto.v1.NameGeneratorService/GetRandomName

    bazel run //example/name_generator/ui:devserver

## TODO

1. eslint
1. v4 of rules-proto-grpc is broken: [Issue 2910](https://github.com/bazelbuild/rules_nodejs/issues/2910)
1. why was it necessary to be explicit with transitive dependency?
1. import paths are awful
1. "builder" style rather than JS objects (if we're going to use this, might as well go to proto3? scala issues?)
1. possible to get grpc-web generated string enums?
1. attempt to use ts-proto?
