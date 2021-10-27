# Bazel Sandbox

One year ago, I put together a sandbox which relied on a lot of patching. Now
that it has become clear that standard practices have not changed, this new
sandbox will attempt to minimize deviation from the norm.

## Usage

### Service

    bazel run //example/name_generator/service

    grpcurl -plaintext -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:50051 example.name_generator.proto.v1.NameGeneratorService/GetRandomName`

### Web

enable Chrome flag: #allow-insecure-localhost

    bazel run //example/name_generator/service:grpcwebproxy

    grpcurl -insecure -proto ./example/name_generator/proto/v1/name_generator_service.proto 127.0.0.1:8443 example.name_generator.proto.v1.NameGeneratorService/GetRandomName

    bazel run //example/ui

### Storyshots

    bazel test //example/name_generator/ui:storyshots

    bazel run //example/name_generator/ui:storyshots.update

#### FIXME

1. need to run outside of bazel to generate first snapshot (`yarn jest -u`)
1. jest config different with and without bazel (tsconfig paths)

## TODO

### Must Have

1. prove grpc-web works in production
1. prove that a create-react-app project can use bazel-built npm package within
   monorepo
1. jest
1. storyshots (html and image)

### Should Have

1. upgrade to v4 of rules-proto-grpc (currently broken: [Issue
   2910](https://github.com/bazelbuild/rules_nodejs/issues/2910))
1. why is it necessary to be explicit with transitive dependency?
1. is there a way around the awful import paths?
1. JS objects rather than "builder" style (if we're going to use this, might as
   well go to proto3? scala issues?)

### Nice to Have

1. attempt to use ts-proto?
1. attempt to use nestjs?
1. possible to get grpc-web generated string enums?
