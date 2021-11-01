module.exports = {
  rules: {
    "no-bazel-bin-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value.includes("bazel-bin/")) {
              context.report({
                fix(fixer) {
                  const newSource = node.source.value.replace("bazel-bin/", "");
                  const [start, end] = node.source.range;

                  return fixer.replaceTextRange(
                    [start + 1, end - 1],
                    newSource
                  );
                },
                message: "Do not use bazel-bin as part of import path",

                node,
              });
            }
          },
        };
      },
    },
  },
};
