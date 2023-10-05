const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );


const JS_DIR = path.resolve(__dirname, 'src')
const BUILD_DIR = path.resolve(__dirname, 'dist/assets')

const plugins = ( argv ) => [
	new CleanWebpackPlugin( {
		cleanStaleWebpackAssets: ( 'production' === argv.mode  )
	} ),
	new MiniCssExtractPlugin( {
		filename: 'css/[name].css'
	} ),
  // new HtmlWebpackPlugin({
  //   title: 'Phumikhmer Video Player',
  //   filename: 'index.html',
  //   template: 'src/index.html',
  // }),
  // new BundleAnalyzerPlugin(),
  // new FixStyleOnlyEntriesPlugin({ extensions:['css'] }),
];

module.exports = (env, argv) => ({
  mode: 'development',
  entry: {
    bundle: JS_DIR + '/index.js',
    // admin: JS_DIR + '/admin.js',
    // helper: JS_DIR + '/helper.js',
    // user_license: JS_DIR + '/user_license.js',
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].js',
    // filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },
  // optimization: {
  //   runtimeChunk: 'single',
  // },
  // devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        // test: /\.js$/,
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env', '@babel/preset-react'],
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  "runtime": "automatic"
                }
              ],
              "@babel/preset-typescript"
            ]
          },
        },
      },
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
      // {
      //   test: /\.css$/i,
      //   include: path.resolve(__dirname, 'src'),
      //   use: ['style-loader', 'css-loader', 'postcss-loader'],
      // },
      {
        // test: /\.s[ac]ss$/i,
        test: /\.scss$/i,
        exclude: /node_modules/,
        // type: 'asset/resource',
        // generator: {
        //   path: BUILD_DIR,
        //   filename: 'css/[name].min.css'
        // },
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
        // use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|svg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        // exclude: /node_modules/,
        use: {
          loader: "file-loader",
          options: {
            name: 'assets/img/[name].[ext]',
            publicPath: 'production' === process.env.NODE_ENV ? '../' : '../../'
          }
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // alias: {
    //   '../../package.json': path.resolve(__dirname, 'package.json'),
    // },
    // fallback: {
    //   // util: require.resolve("util/"),
    //   // stream: require.resolve("stream-browserify"),
    //   crypto: false,
    //   child_process: false,
    //   fs: false,
    //   http2: false,
    //   https: false,
    //   buffer: 'browserify',
    //   process: false,
    //   os: false,
    //   querystring: false,
    //   path: false,
    //   stream: 'stream-browserify',
    //   url: false,
    //   util: false,
    //   zlib: false,
    //   assert: false,
    // }
  },
  plugins: plugins(argv),
  externals: {
		jquery: 'jQuery'
	}
})