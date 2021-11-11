import initStoryshots from "@storybook/addon-storyshots";
import {
  Context as PuppeteerContext,
  imageSnapshot,
} from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import { BoundingBox, Page } from "puppeteer";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ storybook: { type: "string" } })
  .parseSync();

interface Context extends PuppeteerContext {
  clip?: BoundingBox;
  kind: string;
  story: string;
}

initStoryshots({
  test: imageSnapshot({
    // beforeScreenshot: async (page: Page, { context }: { context: Context }) => {
    //   // get bounding box for screenshot
    //   context.clip = await page.evaluate(() => {
    //     const dialogRoot: HTMLElement | null =
    //       document.querySelector(".MuiDialog-root .MuiPaper-root") ||
    //       document.querySelector(".ReactModal__Content");

    //     const element = dialogRoot || document.body;

    //     if (!dialogRoot) {
    //       element.style.display = "inline-flex";
    //     }

    //     const component =
    //       !dialogRoot && document.querySelector("#root > *:first-child");
    //     const boundingBox = (component || element).getBoundingClientRect();

    //     return {
    //       height: Math.ceil(boundingBox.height),
    //       width: Math.ceil(boundingBox.width),
    //       x: Math.floor(boundingBox.left),
    //       y: Math.floor(boundingBox.top),
    //     };
    //   });
    // },
    // customizePage: async (page) => {
    //   // disable animations and blinking cursors
    //   await page.addStyleTag({
    //     content: `
    //       *,
    //       *::after,
    //       *::before {
    //         animation: none !important;
    //         animation-delay: -0.0001s !important;
    //         animation-duration: 0s !important;
    //         animation-play-state: paused !important;
    //         caret-color: transparent !important;
    //         color-adjust: exact !important;
    //         transition: none !important;
    //         transition-delay: 0s !important;
    //         transition-duration: 0s !important;
    //       }
    //       `,
    //   });

    //   await page.setViewport({ height: 1080, width: 1920 });

    //   // avoid :hover
    //   await page.mouse.move(-1, -1);
    // },
    chromeExecutablePath: "/usr/bin/chromium-browser",
    getMatchOptions: ({ context }) => ({
      customSnapshotsDir: path.join(
        __dirname,
        path.dirname((context as unknown as { fileName: string }).fileName),
        "__image_snapshots__"
      ),
    }),
    // getScreenshotOptions: ({ context }) => {
    //   const { clip } = context as unknown as Required<Context>;

    //   return {
    //     clip: clip.height && clip.width ? clip : undefined,
    //     encoding: "base64",
    //     fullPage: !clip.height || !clip.width,
    //   };
    // },
    storybookUrl:
      process.env.RUNFILES && argv.storybook
        ? `file://${path.join(process.env.RUNFILES, "unity", argv.storybook)}`
        : `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
