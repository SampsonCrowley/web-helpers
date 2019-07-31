import cpy from 'rollup-plugin-cpy';
import { createDefaultConfig } from '@open-wc/building-rollup';
import pkg from './package.json';
import path from 'path';
import glob from 'glob';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });
const outputDir = 'package',
      config = createDefaultConfig({
        outputDir,
        input: glob.sync(path.resolve(__dirname, './src/**/*.js'))
      }),
      external = Object.keys( pkg.peerDependencies ).concat([ "path" ])


console.log(config)

export default {
  ...config,
  plugins: [
    ...config.plugins.slice(1),
    cpy({
      files: [
        'package.json'
      ],
      dest: outputDir
    })
  ],
  external,
  // plugins: [
  //   ...config.plugins,
  //   cpy({
  //     files: [
  //       'src/**/*.js',
  //       'package.json'
  //     ],
  //     dest: outputDir
  //   })
  // ]
}
