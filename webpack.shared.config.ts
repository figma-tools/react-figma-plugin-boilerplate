import path from 'path'

const distPath = path.resolve(process.cwd(), 'dist')

export default {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-transform-runtime'],
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },

      { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },

      { test: /\.(png|jpg|gif|webp|zip)$/, loader: 'url-loader' },

      { test: /\.svg$/, loader: 'svg-inline-loader' },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  output: {
    filename: '[name].js',
    path: distPath,
    publicPath: '/',
  },
}
