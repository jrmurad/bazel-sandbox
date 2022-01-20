# Bazel Sandbox

## CONVENTIONS

We conventionally have two kinds of .proto files. One named \*\_service.proto with
only one `service` in it and no `message` types. The rest have no services, only
message types. We have patched ts-proto to depend on this convention in order to
share some generated files between backend and browser.

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

1. browserless dependency through testcontainers
1. mocked grpc-web data
1. prove grpc-web works in production
1. prove that a create-react-app project can use bazel-built npm package within
   monorepo

### Should Have

1. upgrade ts-proto and patch
1. buf lint through bazel
1. eslint through bazel
1. markdownlint through bazel
1. https://github.com/grpc/grpc-node/issues/2002 https://github.com/grpc/grpc-node/issues/2009
