import * as React from 'react'
import { usePluginData } from './hooks'

export function App() {
  const { colors } = usePluginData('colors', { colors: {} })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Colors</h1>
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
