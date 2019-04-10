/**
 * A webpack plugin to remove/clean your build folder(s).
 * Docs: https://www.npmjs.com/package/clean-webpack-plugin
 */

import CleanWebpackPlugin from "clean-webpack-plugin"

const devMode = process.env.NODE_ENV !== "production"

const config = {
  verbose: devMode ? true : false
}

export default () => new CleanWebpackPlugin(config)
