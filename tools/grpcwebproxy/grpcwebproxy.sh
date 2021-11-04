#!/usr/bin/env bash
# Wrapper script for running grpcwebproxy (copied from https://github.com/google/startup-os/blob/master/tools/grpcwebproxy.sh)

platform=$(uname)

if [ "$platform" == "Darwin" ]; then
  BINARY=./tools/grpcwebproxy/grpcwebproxy-v0.14.1-osx-x86_64
elif [ "$platform" == "Linux" ]; then
  BINARY=./tools/grpcwebproxy/grpcwebproxy-v0.14.1-linux-x86_64
else
  echo "grpcwebproxy does not have a binary for $platform"
  exit 1
fi

$BINARY "$@"
