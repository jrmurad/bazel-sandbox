import "regenerator-runtime/runtime";
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import puppeteer from "puppeteer";
import { GenericContainer } from "testcontainers";
import yargs from "yargs/yargs";

const CONTAINER_STORYBOOK_STATIC_DIR = "/opt/storybook-static";

const argv = yargs(process.argv.slice(2))
  .options({ storybook: { type: "string" } })
  .parseSync();

// determine directory based on whether running through bazel
const hostStorybookStaticDir =
  process.env.RUNFILES && argv.storybook
    ? path.join(
        process.env.RUNFILES,
        process.env.BAZEL_WORKSPACE || "",
        argv.storybook
      )
    : path.resolve(__dirname, "storybook-static");

initStoryshots({
  test: imageSnapshot({
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

      // await page.setViewport({ height: 1080, width: 1920 });

      // avoid :hover
      await page.mouse.move(-1, -1);
    },
    getCustomBrowser: async () => {
      const container = await new GenericContainer("browserless/chrome")
        .withBindMount(
          hostStorybookStaticDir,
          CONTAINER_STORYBOOK_STATIC_DIR,
          "ro"
        )
        .withEnv("ALLOW_FILE_PROTOCOL", "true")
        .withExposedPorts(3000)
        .start();

      return puppeteer.connect({
        browserWSEndpoint: `ws://localhost:${container.getMappedPort(3000)}`,
      });
    },
    getMatchOptions: ({ context }) => ({
      customSnapshotsDir: path.join(
        __dirname,
        path.dirname((context as unknown as { fileName: string }).fileName),
        "__image_snapshots__"
      ),
    }),

    storybookUrl: `file://${CONTAINER_STORYBOOK_STATIC_DIR}`,
  }),
});
