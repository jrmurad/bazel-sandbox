docker build -t puppeteer tools/docker/puppeteer

DOCKER_ARGS=(
    --volume /tmp/build_output:/tmp/build_output
    --volume $PWD:/workspace
    --workdir /workspace
)

docker run "${DOCKER_ARGS[@]}" puppeteer --output_user_root=/tmp/build_output test //example/name_generator/frontend:storyshots
# docker run "${DOCKER_ARGS[@]}" puppeteer --output_user_root=/tmp/build_output run //example/name_generator/frontend:storyshots.update
