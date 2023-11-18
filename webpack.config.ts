import express from 'express'
import fs from 'fs'
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import http from 'http'
import path from 'path'
import webpack from 'webpack'
import WebSocket from 'ws'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import sharedConfig from './webpack.shared.config'

const distPath = path.resolve(process.cwd(), 'dist')

export default (env, argv) => {
  /**
   * Figma requires manually going into the app and restarting the plugin with
   * every change. We bypass this for the UI by creating a shell plugin that
   * sets up a WebSocket connection to manage plugin events from a normal dev
   * server. This allows Fast Refresh to work resulting in a tight feedback loop.
   */
  if (argv.mode === 'development') {
    /**
     * Create a WebSocket server to communicate between the shell and our UI.
     */
    const app = express()
    const server = http.createServer(app)
    const wss = new WebSocket.Server({ server })
    let sockets = []

    wss.on('connection', (ws) => {
      sockets.push(ws)

      ws.on('message', (message) => {
        sockets
          .filter((socket) => socket !== ws)
          .forEach((socket) => socket.send(message))
      })

      ws.on('close', () => {
        sockets = sockets.filter((socket) => socket !== ws)
      })
    })

    server.listen(9001)

    /**
     * Create a plugin shell that subscribes to the WebSocket.
     * Note: If we use react-figma we can put this in the webpack plugin config.
     */
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }

    fs.writeFileSync(
      'dist/ui.html',
      `
<script>
  console.log('Connecting to WebSocket...')
  const socket = new WebSocket('ws://localhost:9001/ws');
  socket.onmessage = async (event) => {
    const { type, data } = JSON.parse(await event.data.text());
    if (type === 'plugin') {
      window.parent.postMessage({ pluginMessage: data }, '*');
    }
  };
  onmessage = (event) => {
    if (event.data.pluginMessage) {
      socket.send(JSON.stringify({ type: 'ui', data: event.data }));
    }
  };
</script>    
    `
    )
  }

  return {
    ...sharedConfig,
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    entry:
      argv.mode === 'production'
        ? {
            plugin: './src/plugin.ts',
            ui: './src/ui.tsx',
          }
        : {
            ui: './src/ui.tsx',
          },
    devServer: {
      static: distPath,
      compress: true,
      // open: true,
      // openPage: '/ui.html',
      historyApiFallback: true,
      port: 9000,
    },
    plugins: [
      argv.mode === 'development' && new webpack.HotModuleReplacementPlugin(),
      argv.mode === 'development' && new ReactRefreshPlugin(),
      new HtmlWebpackPlugin({
        meta: { viewport: 'width=device-width, initial-scale=1' },
        templateContent: '<div id="app">',
        filename: 'ui.html',
        inlineSource: '.(js)$',
        chunks: ['ui'],
      }),
      argv.mode === 'production' &&
        // @ts-ignore
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
      argv.mode === 'production' &&
        new webpack.DefinePlugin({
          PLUGIN_VISIBLE: JSON.stringify(true),
        }),
    ].filter(Boolean),
  }
}
