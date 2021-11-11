import "regenerator-runtime/runtime";
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ storybook: { type: "string" } })
  .parseSync();

initStoryshots({
  test: imageSnapshot({
    chromeExecutablePath: "/usr/bin/chromium-browser",
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
    getMatchOptions: ({ context }) => ({
      customSnapshotsDir: path.join(
        __dirname,
        path.dirname((context as unknown as { fileName: string }).fileName),
        "__image_snapshots__"
      ),
    }),
    storybookUrl:
      process.env.RUNFILES && argv.storybook
        ? `file://${path.join(process.env.RUNFILES, "unity", argv.storybook)}`
        : `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
