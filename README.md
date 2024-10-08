# Webpack Configuration for a React Project with TypeScript

This document outlines the Webpack configuration used for a React project with TypeScript, Sass, and Module Federation.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Dependencies](#dependencies)
3. [Webpack Configuration](#webpack-configuration)
   - [Entry Point](#entry-point)
   - [Mode](#mode)
   - [Source Maps](#source-maps)
   - [Output](#output)
   - [Module Rules](#module-rules)
   - [Resolve](#resolve)
   - [DevServer](#devserver)
   - [Plugins](#plugins)

## Project Structure

```
my-project/
│
├── src/
│   ├── index.tsx
│   └── ... (other source files)
│
├── public/
│   └── index.html
│
├── dist/
│   └── (generated files will be placed here)
│
└── webpack.config.ts
```

## Dependencies

To use this setup, make sure you have the following packages installed:

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server \
  html-webpack-plugin mini-css-extract-plugin esbuild-loader \
  sass-loader css-loader typescript @types/react @types/react-dom
```

## Webpack Configuration

This is the Webpack configuration file (`webpack.config.ts`) for the project:

```typescript
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
                localIdentName: "[name]__[local]__[chunkhash]",
              },
            },
          },
          "sass-loader",
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
```

### Entry Point

- **entry:** `./src/index.tsx`
  - The main entry point of the application.

### Mode

- **mode:** `development`
  - Specifies that the build is in development mode, which enables useful tooling for development.

### Source Maps

- **devtool:** `eval-cheap-module-source-map`
  - Enables source maps that are efficient to build but still provide accurate mapping.

### Output

- **output:**
  - `filename:` `"core/js/script__[contenthash].js"`: The name of the main JavaScript file, including a content hash for caching.
  - `chunkFilename:` `"core/js/script-chunk__[contenthash].js"`: The name of chunk files.
  - `path:` `path.resolve(__dirname, "dist")`: The output directory.
  - `publicPath:` `"/"`: The base path for all assets.

### Module Rules

- **rules:**
  - **TypeScript and JavaScript:**
    - Uses `esbuild-loader` for fast transpilation.
    - Targets ES2015 JavaScript.
  - **Sass:**
    - Handles `.scss` files with `sass-loader`.
    - `css-loader` is configured to use CSS modules with a custom local identifier name format.

### Resolve

- **resolve:**
  - Specifies the extensions that Webpack should resolve: `.js`, `.jsx`, `.ts`, `.tsx`, and `.scss`.

### DevServer

- **devServer:**
  - **port:** `9000`: The server will run on port 9000.
  - **hot:** `true`: Enables Hot Module Replacement.
  - **historyApiFallback:** `true`: Enables HTML5 History API support, making it possible to serve single-page applications.
  - **watchFiles:** `path.resolve(__dirname, "src")`: Watches for changes in the `src` directory.

### Plugins

- **MiniCssExtractPlugin:**
  - Extracts CSS into separate files for production use.
- **HtmlWebpackPlugin:**
  - Generates the `index.html` file with the correct script tags injected.
- **ModuleFederationPlugin:**
  - Enables Module Federation, allowing this application to consume remote modules from `remote_basic` hosted at `http://localhost:8000`.
  - Shared dependencies (`react`, `react-dom`) are configured to be singleton and eager-loaded.
