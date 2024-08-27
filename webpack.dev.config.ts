import path from "path";
import { Configuration, container as WebpackContainer } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  entry: "./src/index.tsx",
  mode: "development",
  target: "web",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "core/js/script__[contenthash].js",
    chunkFilename: "core/js/script-chunk__[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
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
  devServer: {
    port: 9000,
    hot: true,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "core/css/styles__[contenthash].css",
      chunkFilename: "core/css/styles-chunk__[contenthash].css",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new WebpackContainer.ModuleFederationPlugin({
      name: "host",
      remotes: {
        remote_basic:
          "remote_basic@http://localhost:8000/core/js/remote/remote_basic_entry.js",
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        "react-dom": {
          singleton: true,
          eager: true,
        },
      },
    }),
  ],
} as Configuration;
