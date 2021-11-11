docker build -t bazel-puppeteer tools/docker/bazel-puppeteer

DOCKER_ARGS=(
    --env UID=$(id -u)
    --env GID=$(id -g)
    --volume $PWD:/workspace
    --workdir /workspace
)

docker run "${DOCKER_ARGS[@]}" bazel-puppeteer --output_user_root=/workspace/.docker-bazel-puppeteer test //example/name_generator/frontend:storyshots
# docker run "${DOCKER_ARGS[@]}" bazel-puppeteer --output_user_root=/workspace/.docker-bazel-puppeteer run //example/name_generator/frontend:storyshots.update
