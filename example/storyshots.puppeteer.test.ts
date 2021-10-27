import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

initStoryshots({
  test: imageSnapshot({
    getMatchOptions: ({ context: { fileName } }) => ({
      customSnapshotsDir: path.join(
        __dirname,
        path.dirname(fileName),
        "__image_snapshots__"
      ),
    }),
    storybookUrl: `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
