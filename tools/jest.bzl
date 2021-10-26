"jest"

load("@npm//jest-cli:index.bzl", "jest", _jest_test = "jest_test")

def jest_test(name, srcs, data = [], jest_config = "//:jest.config.js", **kwargs):
    """a macro around the autogenerated jest_test rule

    Args:
        name: passed through to jest-cli rule
        data: snapshot files
        jest_config: defaults to //:jest.config.js
        srcs: spec/test files
        **kwargs: variadic keyword arguments
    """

    all_data = [jest_config] + srcs + data

    templated_args = [
        "--ci",
        "--colors",
        "--no-cache",
        "--no-watchman",
    ]

    templated_args.extend(["--config", "$(rootpath %s)" % jest_config])

    for src in srcs:
        templated_args.extend(["--runTestsByPath", "$(rootpaths %s)" % src])

    _jest_test(
        name = name,
        data = all_data,
        templated_args = templated_args,
        **kwargs
    )

    jest(
        name = name + ".update",
        data = all_data,
        templated_args = templated_args + ["-u"],
    )
