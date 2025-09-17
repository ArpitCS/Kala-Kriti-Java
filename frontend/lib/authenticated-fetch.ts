export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // Do NOT send Authorization for any /api/admin/ endpoint
  const isAdminEndpoint = url.includes("/api/admin/")

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

  if (!isAdminEndpoint) {
    const credentials = localStorage.getItem("kala-kriti-credentials")
    if (credentials) headers["Authorization"] = `Basic ${credentials}`
  }

  return fetch(url, { ...options, headers })
}
