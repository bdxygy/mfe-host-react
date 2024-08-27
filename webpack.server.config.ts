import path from "path";
import { Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodeExternals from "webpack-node-externals";
import TerserPlugin from "terser-webpack-plugin";

export default {
  entry: "./cmd/main.tsx",
  mode: "production",
  // mode: "development",
  target: "node",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "main.js",
    chunkFilename: "server/js/server_chunk__[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  externals: [NodeExternals()],
  module: {
    rules: [
      // {
      //   test: /\.[jt]sx?$/,
      //   exclude: /node_modules/,
      //   loader: "esbuild-loader",
      //   options: {
      //     target: "es2015",
      //     legalComments: "none",
      //   },
      // },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                // mode: "local",
                localIdentName: "[name]__[local]__[chunkhash]",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "server/css/server_styles__[contenthash].css",
      chunkFilename: "server/css/server_styles-chunk__[contenthash].css",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "v",
          chunks: "all",
          minSize: 5000, // Adjust this value to be less than maxSize
          maxSize: 5000, // Ensure this is greater than minSize
        },
      },
    },
  },
} as Configuration;
