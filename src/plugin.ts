import { figmaRGBToHex } from '@figma-plugin/helpers'
import { dispatch } from './utils'

declare const PLUGIN_VISIBLE: boolean

figma.showUI(__html__, {
  visible: typeof PLUGIN_VISIBLE === 'boolean',
})

figma.ui.onmessage = (message) => {
  if (message.type === 'set-colors') {
    dispatch({
      type: 'colors',
      data: {
        colors: Object.fromEntries(
          figma.getLocalPaintStyles().map((paintStyle) => [
            paintStyle.name,
            {
              description: paintStyle.description,
              fills: paintStyle.paints
                .filter((paint) => paint.type === 'SOLID')
                .map((paint: SolidPaint) => figmaRGBToHex(paint.color)),
            },
          ])
        ),
      },
    })
  }
}
