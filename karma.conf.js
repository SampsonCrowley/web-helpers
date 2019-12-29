/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      concurrency: 1,
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep
            ? config.grep
            : '{components,configs,loaders,utils}/*/test/**/*.test.js',
          type: 'module'
        },
      ],

      esm: {
        nodeResolve: true,
      },
      // you can overwrite/extend the config further
    }),
  );
  return config;
};