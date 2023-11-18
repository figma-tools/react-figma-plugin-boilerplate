import path from 'path'

const distPath = path.resolve(process.cwd(), 'dist')

export default {
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'swc-loader', exclude: /node_modules/ },
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
