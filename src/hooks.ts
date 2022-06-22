import * as React from 'react'

export function usePluginData(type, initialData = null) {
  const [data, setData] = React.useState(initialData)

  React.useEffect(() => {
    function handleMessage(event) {
      if (event.data.pluginId && event.data.pluginMessage.type === 'plugin') {
        const pluginData = event.data.pluginMessage.data
        if (pluginData.type === type) {
          setData(pluginData.data)
        }
      }
    }

    parent.postMessage({ pluginMessage: { type: `set-${type}`, data } }, '*')

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return data
}

export function usePluginState(type, initialData = null) {
  const data = usePluginData(type, initialData)
  const setData = (data) => {
    parent.postMessage({ pluginMessage: { type: `set-${type}`, data } }, '*')
  }

  return [data, setData]
}
