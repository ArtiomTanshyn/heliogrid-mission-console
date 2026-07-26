export async function delayed<T>(factory: () => T, delay = 450): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, delay))
  return factory()
}
