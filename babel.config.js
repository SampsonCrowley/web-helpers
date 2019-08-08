module.exports = function (api) {
  api.cache(false);

  const presets = [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: [
                  "last 1 Chrome major versions",
                  "last 1 Firefox major versions",
                  "last 1 Safari major versions",
                ]
              },
              useBuiltIns: "entry",
              corejs: "3",
              spec: true,
              modules: false,
              loose: false,
              shippedProposals: true,
            }
          ]
        ],
        plugins = [
          [ "@babel/plugin-proposal-decorators", { decoratorsBeforeExport: false } ],
          "@babel/plugin-proposal-object-rest-spread",
          "@babel/plugin-syntax-dynamic-import",
          [ "@babel/plugin-proposal-class-properties", { loose: false } ],
        ],
        babelrcRoots = [
          ".",
          "components/*",
          "components/*/demo",
          "configs/*",
          "loaders/*",
          "utils/*",
        ];

  return {
    presets,
    plugins,
    babelrcRoots,
  };
}
