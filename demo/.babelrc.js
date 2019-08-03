console.log('root BABEL')
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
              spec: true,
              modules: 'all',
              loose: false,
              shippedProposals: true,
            }
          ]
        ],
        plugins = [
          [ "@babel/plugin-proposal-class-properties", { loose: false } ]
        ];

  return {
    presets,
    plugins
  };
}
