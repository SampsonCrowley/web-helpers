const path = require('path');
const _mainBasePath = path.dirname(module.parent.filename);
delete require.cache[__filename];

const glob = require('glob');

const JSMinifierPlugin = require('terser-webpack-plugin');
const CSSMinifierPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const babelPlugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-transform-template-literals"
]

const esmBrowsers = [
  /**
   *  Browser List: https://bit.ly/2Yjs58M
   */
  'Edge >= 16',
  'Firefox >= 60',
  'Chrome >= 61',
  'Safari >= 11',
  'Opera >= 48'
]

const legacyBrowsers = [
  "last 5 versions",
  "ie >= 9"
]


module.exports = {
  babelPlugins: babelPlugins,
  esmBrowsers: esmBrowsers,
  legacyBrowsers: legacyBrowsers,
  createConfig: (_options) => {
    const userOptions = _options || {}

    const _basePath = userOptions.configDir || _mainBasePath

    const LitHTMLLoader = {
      loader: '@web-helpers/lit-html-loader',
      options: {
        filename: '[path][name].html',
        path: path.resolve(_basePath, '../priv/static/html'),
        aliasedAs: 'html',
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        }
      }
    }

    const ESMBabelLoader = {
      loader: 'babel-loader',
      options: {
        presets: userOptions.esmBabelPresets || [
          [
            '@babel/preset-env',
            {
                targets: {
                    browsers: userOptions.esmBrowsers || esmBrowsers
                },
                useBuiltIns: 'usage',
                modules: false,
                corejs: 3
            }
          ]
        ],
        plugins: userOptions.esmBabelPlugins || userOptions.babelPlugins || babelPlugins
      }
    }

    const CJSBabelLoader = {
      loader: 'babel-loader',
      options: {
        presets: userOptions.legacyBabelPresets || [
          [
            '@babel/preset-env',
            {
                targets: {
                    browsers: userOptions.legacyBrowsers || legacyBrowsers
                },
                useBuiltIns: 'usage',
                modules: false,
                corejs: 3
            }
          ]
        ],
        plugins: userOptions.legacyBabelPlugins || userOptions.babelPlugins || babelPlugins
      }
    }

    return (env, options) => ([
      {
        devtool: 'source-map',
        optimization: {
          runtimeChunk: {
            name: 'shared-runtime'
          },
          namedChunks: true,
          splitChunks: {
            chunks: 'all',
          },
          minimizer: [
            new JSMinifierPlugin({ cache: true, parallel: true, sourceMap: true }),
            new CSSMinifierPlugin({})
          ]
        },
        entry: {
            app: [path.resolve(_basePath, 'js/app.js')].concat(glob.sync(path.resolve(_basePath, 'vendor/**/*.js')))
        },
        output: {
          filename: '[name].js',
          path: path.resolve(_basePath, '../priv/static/js'),
          publicPath: '/js/',
          chunkFilename: '[name].js'
        },
        resolve: {
          extensions: [ '.js', '.jsx', '.styl', '.css' ],
          alias: {
            css: path.resolve(_basePath, 'css'),
            html: path.resolve(_basePath, 'html'),
            images: path.resolve(_basePath, 'static', 'images')
          },
          modules: [
            path.resolve(_basePath, 'js'),
            'node_modules'
          ]
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              // exclude: /node_modules/,
              use: CJSBabelLoader,
              include: [
                // These packages are distributed as es2015 modules, therefore they need
                // to be transpiled to es5.
                path.resolve(_basePath, 'js'),
                /node_modules(?:\/|\\)lit-element|lit-html|@web-helpers/
              ]
            },
            {
              test: /\.(css|styl(?:us)?)$/,
              use: [
                // CJSBabelLoader,
                CJSBabelLoader,
                '@web-helpers/lit-css-loader',
                'stylus-loader'
              ]
            },
            {
              test: /\.html?$/,
              use: [
                // 'raw-loader',
                // CJSBabelLoader,
                CJSBabelLoader,
                LitHTMLLoader,
              ]
            },
            // {
            //   test: /\.(ico|tiff?|png|jpe?g|pdf|woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            //   use: [
            //     'file-loader'
            //   ]
            // },
            {
              exclude: /\.(?:html?|jsx?|styl(?:us)?|css)$/,
              use: [
                'url-loader'
              ]
            }
          ]
        },
        plugins: [
          new CopyWebpackPlugin([{ from: path.resolve(_basePath, 'static/'), to: path.resolve(_basePath, '../priv/static/') }])
        ]
      },
      {
        devtool: 'source-map',
        optimization: {
          runtimeChunk: {
            name: 'shared-runtime'
          },
          splitChunks: {
            chunks: 'all',
          },
          minimizer: [
            new JSMinifierPlugin({ cache: true, parallel: true, sourceMap: true }),
            new CSSMinifierPlugin({})
          ]
        },
        entry: {
            app: ['./js/app.esm.js'].concat(glob.sync(path.resolve(_basePath, 'vendor/**/*.js')))
        },
        output: {
          filename: '[name].esm.js',
          path: path.resolve(_basePath, '../priv/static/js'),
          publicPath: '/js/',
          chunkFilename: '[name].esm.js'
        },
        resolve: {
          extensions: [ '.mjs', '.esm.js', '.js', '.jsx', '.styl', '.css' ],
          alias: {
            css: path.resolve(_basePath, 'css'),
            html: path.resolve(_basePath, 'html'),
            images: path.resolve(_basePath, 'static', 'images')
          },
          modules: [
            path.resolve(_basePath, 'js'),
            'node_modules'
          ]
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              use: ESMBabelLoader,
              include: [
                // These packages are distributed as es2015 modules, therefore they need
                // to be transpiled to es5.
                path.resolve(_basePath, 'js'),
                /node_modules(?:\/|\\)lit-element|lit-html|@web-helpers/
              ]
            },
            {
              test: /\.(css|styl(?:us)?)$/,
              use: [
                ESMBabelLoader,
                '@web-helpers/lit-css-loader',
                'stylus-loader'
              ]
            },
            {
              test: /\.html?$/,
              use: [
                // 'raw-loader',
                ESMBabelLoader,
                LitHTMLLoader,
              ]
            },
            // {
            //   test: /\.(ico|tiff?|png|jpe?g|pdf|woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            //   use: [
            //     'file-loader'
            //   ]
            // },
            {
              exclude: /\.(?:html?|jsx?|styl(?:us)?|css)$/,
              use: [
                'url-loader'
              ]
            }
          ]
        },
        plugins: [
          new CopyWebpackPlugin([{ from: path.resolve(_basePath, 'static/'), to: path.resolve(_basePath, '../priv/static/') }])
        ]
      }
    ]);
  }
}
