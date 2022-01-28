import "regenerator-runtime/runtime";
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import puppeteer from "puppeteer";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import yargs from "yargs/yargs";

const CONTAINER_STORYBOOK_STATIC_DIR = "/opt/storybook-static";

const argv = yargs(process.argv.slice(2))
  .options({ storybook: { type: "string" } })
  .parseSync();

function getBazelStorybookStatic() {
  if (!process.env.RUNFILES || !argv.storybook) {
    throw Error("missing bazel env vars and/or jest argument");
  }

  // ugly hack around inability for bazel to provide path to non-symlinked files
  // docker/testcontainers can't resolve the symlinks
  // furthermore, can't use realpath because bazel patches node symlink handling
  return process.env.RUNFILES.replace(
    /sandbox\/\w+-sandbox\/\d+\//,
    ""
  ).replace(/\/bin\/.*$/, path.sep + path.join("bin", argv.storybook));
}

// determine directory based on whether running through bazel
const hostStorybookStaticDir = process.env.BAZEL_WORKSPACE
  ? getBazelStorybookStatic()
  : path.resolve(__dirname, "storybook-static");

let browser: puppeteer.Browser | undefined;
let container: StartedTestContainer | undefined;

const test = imageSnapshot({
  customizePage: async (page) => {
    // disable animations and blinking cursors
    await page.addStyleTag({
      content: `
        *,
        *::after,
        *::before {
          animation: none !important;
          animation-delay: -0.0001s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          caret-color: transparent !important;
          color-adjust: exact !important;
          transition: none !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
        }
        `,
    });

    // JRM FIXME fit to contents
    // await page.setViewport({ height: 1080, width: 1920 });

    // avoid :hover
    await page.mouse.move(-1, -1);
  },
  getCustomBrowser: async () => {
    container = await new GenericContainer("browserless/chrome")
      .withBindMount(
        hostStorybookStaticDir,
        CONTAINER_STORYBOOK_STATIC_DIR,
        "ro"
      )
      .withEnv("ALLOW_FILE_PROTOCOL", "true")
      .withExposedPorts(3000)
      .start();

    browser = await puppeteer.connect({
      browserWSEndpoint: `ws://localhost:${container.getMappedPort(3000)}`,
    });

    return browser;
  },
  getMatchOptions: ({ context }) => ({
    customSnapshotsDir: path.join(
      __dirname,
      path.dirname((context as unknown as { fileName: string }).fileName),
      "__image_snapshots__"
    ),
  }),

  storybookUrl: `file://${CONTAINER_STORYBOOK_STATIC_DIR}`,
});

test.afterAll = async () => {
  if (browser) {
    await browser.close();
  }

  if (container) {
    await container.stop();
  }
};

initStoryshots({ test });
