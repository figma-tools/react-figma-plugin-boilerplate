import { figmaRGBToHex } from '@figma-plugin/helpers'

declare const PLUGIN_VISIBLE: boolean

figma.showUI(__html__, {
  visible: typeof PLUGIN_VISIBLE === 'boolean',
})

figma.ui.onmessage = (message) => {
  if (message.type === 'fetch-colors') {
    figma.ui.postMessage({
      type: 'plugin',
      data: Object.fromEntries(
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
    })
  }
}
