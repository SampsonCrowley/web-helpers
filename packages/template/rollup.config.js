import cpy from 'rollup-plugin-cpy';
import { createCompatibilityConfig } from '@open-wc/building-rollup';

// if you need to support IE11 use "modern-and-legacy-config" instead.
// import { createCompatibilityConfig } from '@open-wc/building-rollup';
// export default createCompatibilityConfig({ input: './index.html' });
const outputDir = 'package',
      config = createCompatibilityConfig({
        outputDir,
        input: './src/index.html'
      });

console.log(config)

export default [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      cpy({
        files: [
          'src/**/*.js',
          'package.json'
        ],
        dest: outputDir
      })
    ]
  },
  config[1]
]
