export function dispatch(data) {
  figma.ui.postMessage({
    type: 'plugin',
    data,
  })
}
