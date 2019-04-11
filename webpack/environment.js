import { environmentPlugins } from "./plugins"
const devMode = process.env.NODE_ENV !== "production"

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    plugins: environmentPlugins,
}
