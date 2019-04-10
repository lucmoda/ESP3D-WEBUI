import compressionPlugin from "./compression-plugin"
import htmlWebpackInlineSourcePlugin from "./html-webpack-inline-source-plugin"
import htmlWebpackPlugin from "./html-webpack-plugin"
import htmlMinifierWebpackPlugin from "./html-minifier-webpack-plugin"
import removeFilesWebpackPlugin from "./remove-files-webpack-plugin"

export const environmentPlugins = [
  htmlWebpackPlugin(),   
]

export const productionPlugins = [
  htmlWebpackInlineSourcePlugin(),
  htmlMinifierWebpackPlugin(),
  compressionPlugin(),
  removeFilesWebpackPlugin()
]
