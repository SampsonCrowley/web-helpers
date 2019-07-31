module.exports = function (api) {
  api.cache(false);

  const presets = [
          [
            "@babel/preset-env",
            {
              "targets": {
                "browsers": [
                  "last 2 versions",
                  "ie >= 11"
                ]
              }
            }
          ]
        ],
        plugins = [
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-transform-template-literals"
        ];

  return {
    presets,
    plugins
  };
}
