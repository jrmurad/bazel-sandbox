# Unity

## Usage

`bazel run //example/services/name_generator`
`grpcurl -plaintext -proto ./example/services/name_generator/v1/name_generator_service.proto localhost:50051 example.services.name_generator.v1.NameGeneratorService/GetRandomName`

## TODO

1. eslint
1. vscode settings
1. v4 of rules-proto-grpc is broken: [Issue 2910](https://github.com/bazelbuild/rules_nodejs/issues/2910)
1. why was it necessary to be explicit with transitive dependency?
1. import paths are awful
1. "builder" style rather than JS objects (if we're going to use this, might as well go to proto3? scala issues?)
1. attempt to use ts-proto?
