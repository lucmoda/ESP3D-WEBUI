import merge from "webpack-merge"
import environment from "./environment"

module.exports = merge(environment, {
	devServer: {
    // Display only errors to reduce the amount of output.
    stats: "errors-only",
    overlay: true,
    open: true, // Open the page in browser
  },

})
