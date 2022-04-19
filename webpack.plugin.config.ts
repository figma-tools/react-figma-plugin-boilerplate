import sharedConfig from './webpack.shared.config'

export default () => {
  return {
    ...sharedConfig,
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      plugin: './src/plugin.ts',
    },
  }
}
