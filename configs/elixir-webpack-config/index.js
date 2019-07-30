const path = require('path');
const glob = require('glob');
const _basePath = path.dirname(require.main.filename)

const JSMinifierPlugin = require('terser-webpack-plugin');
const CSSMinifierPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LitCSSLoader = {
  loader: '@web-helpers/lit-css-loader'
}
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
  createConfig: (options) => {
    options = options || {}

    const ESMBabelLoader = {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
                targets: {
                    browsers: options.esmBrowsers || esmBrowsers
                },
                useBuiltIns: 'usage',
                modules: false,
                corejs: 3
            }
          ]
        ],
        plugins: options.esmBabelPlugins || options.babelPlugins || babelPlugins
      }
    }

    const CJSBabelLoader = {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
                targets: {
                    browsers: options.legacyBrowsers || legacyBrowsers
                },
                useBuiltIns: 'usage',
                modules: false,
                corejs: 3
            }
          ]
        ],
        plugins: options.legacyBabelPlugins || options.babelPlugins || babelPlugins
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
            app: ['./js/app.js'].concat(glob.sync('./vendor/**/*.js'))
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
                LitCSSLoader,
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
          new CopyWebpackPlugin([{ from: 'static/', to: '../' }])
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
            app: ['./js/app.esm.js'].concat(glob.sync('./vendor/**/*.js'))
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
                // /node_modules(?:\/|\\)lit-element|lit-html/
              ]
            },
            {
              test: /\.(css|styl(?:us)?)$/,
              use: [
                ESMBabelLoader,
                LitCSSLoader,
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
          new CopyWebpackPlugin([{ from: 'static/', to: '../' }])
        ]
      }
    ]);
  }
}
