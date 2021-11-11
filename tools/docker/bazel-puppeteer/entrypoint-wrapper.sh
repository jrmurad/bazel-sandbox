#!/usr/bin/env bash

/usr/bin/bazel "$@"

find common example -type d \( -name "__snapshots__" -o -name "__image_snapshots__" \) -user root -exec chown -R $UID.$GID {} \;

# it's possible that running tests caused dependency changes to get installed
find node_modules -user root -exec chown $UID.$GID {} \;
