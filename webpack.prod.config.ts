import { merge } from "webpack-merge";
import WebpackDevConfig from "./webpack.dev.config";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinifyPlugin from "mini-css-extract-plugin";

export default merge(WebpackDevConfig, {
  devtool: "hidden-source-map",
  output: {
    publicPath: "auto",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
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
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/assets",
          to: "assets",
        },
      ],
    }),
    new CssMinifyPlugin({
      filename: "core/css/styles__[contenthash].css",
      chunkFilename: "core/css/styles-chunk__[contenthash].css",
    }),
  ],
});
