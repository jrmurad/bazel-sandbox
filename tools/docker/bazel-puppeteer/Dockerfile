FROM l.gcr.io/google/bazel:latest

RUN \
    apt-get update && \
    apt-get install --no-install-recommends -y chromium-browser ttf-freefont

RUN \
    curl -L https://github.com/bazelbuild/bazelisk/releases/download/v1.10.1/bazelisk-linux-amd64 > /usr/bin/bazel && \
    chmod +x /usr/bin/bazel

RUN bazel version

ENTRYPOINT [ "/workspace/tools/docker/bazel-puppeteer/entrypoint-wrapper.sh" ]
