export async function getFetch() {
  if (typeof fetch !== 'undefined') {
    return fetch
  }
  const { default: nodeFetch } = await import('node-fetch')
  return nodeFetch as unknown as typeof fetch
}
