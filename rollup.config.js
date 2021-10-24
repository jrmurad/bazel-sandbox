import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from '@rollup/plugin-node-resolve';
import path from "path";

const projectRoot = path
  .resolve(__dirname)
  .replace(/^(.+\/bazel-out\/[^/]+\/bin).*$/, "$1");

export default {
  plugins: [
    commonjs(),
    alias({
      entries: [{ find: /^unity\/(.+)$/, replacement: `${projectRoot}/$1` }],
    }),
    resolve(),
  ],
};
