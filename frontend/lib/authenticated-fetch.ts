export async function authenticatedFetch(url: string, options: RequestInit = {}) {

  // Normalize headers to a plain object
  let headers: Record<string, string> = {}
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value
      })
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value
      })
    } else {
      headers = { ...options.headers as Record<string, string> }
    }
  }

  const credentials = typeof window !== "undefined" ? localStorage.getItem("kala-kriti-credentials") : null
  if (credentials) headers["Authorization"] = `Basic ${credentials}`

  return fetch(url, { ...options, headers })
}
