import path from "path";
import { Configuration, container as WebpackContainer } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  entry: "./src/index.tsx",
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "core/js/script__[contenthash].js",
    chunkFilename: "core/js/script-chunk__[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
          legalComments: "none",
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
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      minify: true,
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
