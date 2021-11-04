import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .options({ storybook: { type: "string" } })
  .parseSync();

initStoryshots({
  test: imageSnapshot({
    getMatchOptions: ({ context: { fileName } }) => ({
      customSnapshotsDir: path.join(
        __dirname,
        path.dirname(fileName),
        "__image_snapshots__"
      ),
    }),
    storybookUrl: process.env.RUNFILES
      ? `file://${path.join(process.env.RUNFILES, "unity", argv.storybook)}`
      : `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
