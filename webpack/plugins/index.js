import htmlWebpackPlugin from "./html-webpack-plugin"
import cleanWebpackPlugin from "./clean-webpack-plugin"

export const environmentPlugins = [
  htmlWebpackPlugin(),
  cleanWebpackPlugin(),    
]
