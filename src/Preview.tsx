import * as React from 'react'
import { App } from './App'

/**
 * Preview is responsible for intercepting the window events in development
 * and forwarding them to the web socket server. Since we render outside
 * of Figma this allows us to still communicate with the canvas.
 */
export function Preview() {
  const [connected, setConnected] = React.useState(false)

  React.useLayoutEffect(() => {
    const socket = new WebSocket('ws://localhost:9001/ws')
    const handleSocketOpen = () => setConnected(true)

    /**
     * Intercepts messages coming from the plugin to the ui and posts them to
     * the current window.
     */
    const handleSocketMessage = async (event) => {
      const { type, data } = JSON.parse(await event.data.text())
      if (type === 'ui') {
        window.postMessage(data, '*')
      }
    }

    /**
     * Intercept pluginMessage calls from the UI and forward them to the
     * web socket server which will then send messages to the plugin.
     */
    const handleWindowMessage = (event) => {
      if (event.data.pluginMessage) {
        socket.send(
          JSON.stringify({
            type: 'plugin',
            data: event.data.pluginMessage,
          })
        )
      }
    }

    socket.addEventListener('open', handleSocketOpen)
    socket.addEventListener('message', handleSocketMessage)
    window.addEventListener('message', handleWindowMessage)

    return () => {
      window.removeEventListener('message', handleWindowMessage)
      socket.removeEventListener('message', handleSocketMessage)
      socket.removeEventListener('open', handleSocketOpen)
      socket.close()
    }
  }, [])

  return connected ? <App /> : <>Connecting to Figma plugin...</>
}
