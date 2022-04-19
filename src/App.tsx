import * as React from 'react'

export function App() {
  const [colors, setColors] = React.useState([])

  React.useEffect(() => {
    /** Listen to events from the plugin */
    function handleMessage(event) {
      if (event.data.pluginId) {
        const { data } = event.data.pluginMessage
        setColors(data)
      }
    }

    parent.postMessage({ pluginMessage: { type: 'fetch-colors' } }, '*')

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(colors).map(([name, data]) => (
        <div key={name} style={{ display: 'flex', padding: 8, gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: data.fills[0],
            }}
          />{' '}
          {name}
        </div>
      ))}
    </div>
  )
}
