workspace(
    name = "unity",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# --- nodejs ---

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "d63ecec7192394f5cc4ad95a115f8a6c9de55c60d56c1f08da79c306355e4654",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.6.1/rules_nodejs-4.6.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    package_json = ["//:package.json"],
)

yarn_install(
    name = "npm",
    data = [
        "//:patches/npm/@grpc+proto-loader+0.6.6.patch",
        "//:patches/npm/ts-proto+1.85.0.patch",
    ],
    frozen_lockfile = True,
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

# --- rules_proto ---

http_archive(
    name = "build_stack_rules_proto",
    patch_args = ["-p1"],
    patches = ["//:patches/bazel/rules_proto.patch"],
    sha256 = "8f294b46f490125b5f69b71080c5263ef8875bf3fc0c48b3e259dad765f4d1fd",
    strip_prefix = "rules_proto-8a3d37c45605582c0e905747a33c216ece66a805",
    urls = ["https://github.com/stackb/rules_proto/archive/8a3d37c45605582c0e905747a33c216ece66a805.tar.gz"],
)

register_toolchains("@build_stack_rules_proto//toolchain:standard")

# --- proto core ---

load("@build_stack_rules_proto//deps:core_deps.bzl", "core_deps")

core_deps()

load("@build_stack_rules_proto//deps:protobuf_core_deps.bzl", "protobuf_core_deps")

protobuf_core_deps()

# --- rules_go ---

load(
    "@io_bazel_rules_go//go:deps.bzl",
    "go_register_toolchains",
    "go_rules_dependencies",
)

go_rules_dependencies()

go_register_toolchains(version = "1.17.2")

# --- gazelle ---

load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")

gazelle_dependencies()

# --- gazelle extension dependencies ---

load("@build_stack_rules_proto//:go_deps.bzl", "gazelle_protobuf_extension_go_deps")

gazelle_protobuf_extension_go_deps()

# --- nodejs ---

load("@build_stack_rules_proto//deps:nodejs_deps.bzl", "nodejs_deps")

nodejs_deps()

# --- other --- #

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()
