# Bazel Sandbox

One year ago, I put together a sandbox which relied on a lot of patching. Now
that it has become clear that standard practices have not changed, this new
sandbox will attempt to minimize deviation from the norm.

## Usage

### Service

    bazel run //example/name_generator/service

    grpcurl -plaintext -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:50051 example.name_generator.proto.v1.NameGenerator/GetRandomName`

### Web

enable Chrome flag: #allow-insecure-localhost

    bazel run //example/name_generator/service:grpcwebproxy

    grpcurl -insecure -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:8443 example.name_generator.proto.v1.NameGenerator/GetRandomName

    bazel run //example/frontend

### Storyshots

    bazel test //example/name_generator/frontend:storyshots

    bazel run //example/name_generator/frontend:storyshots.update

## TODO

### Must Have

1. prove grpc-web works in production
1. different outputs for grpc-web
1. prove that a create-react-app project can use bazel-built npm package within
   monorepo
1. storyshots (images with docker)

### Should Have

1. patch ts-proto proto2 optional
1. PR rules_proto with esModuleInterop so we don't need to patch proto-loader?
