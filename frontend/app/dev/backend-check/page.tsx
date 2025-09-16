"use client"

import { useState } from "react"

const API_BASE_URL = "http://localhost:8080/api"

type Json = any

export default function BackendCheckPage() {
  const [output, setOutput] = useState<Json>(null)
  const [status, setStatus] = useState<string>("")

  const run = async (label: string, fn: () => Promise<Response>) => {
    setStatus(`Running: ${label}`)
    try {
      const res = await fn()
      let body: any = null
      try {
        body = await res.clone().json()
      } catch {
        body = await res.text()
      }
      setOutput({ label, ok: res.ok, status: res.status, body })
      setStatus("")
    } catch (e: any) {
      setOutput({ label, ok: false, error: String(e) })
      setStatus("")
    }
  }

  // Inputs
  const [artworkId, setArtworkId] = useState("1")
  const [artistId, setArtistId] = useState("1")
  const [title, setTitle] = useState("")
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("10000")

  const [userId, setUserId] = useState("1")
  const [cartItemId, setCartItemId] = useState("1")
  const [orderId, setOrderId] = useState("1")
  const [orderStatus, setOrderStatus] = useState("PENDING")

  const [username, setUsername] = useState("testuser")
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password")

  const [bio, setBio] = useState("My bio")
  const [profileId, setProfileId] = useState("1")

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Backend Connectivity Check</h1>
      <p className="text-sm text-gray-500">Temporary page to exercise backend endpoints. Remove before production.</p>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Artworks</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artworks", () => fetch(`${API_BASE_URL}/artworks`))}>List</button>
          <input className="border px-2 py-1 w-24" value={artworkId} onChange={(e) => setArtworkId(e.target.value)} placeholder="id" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artworks/{id}", () => fetch(`${API_BASE_URL}/artworks/${artworkId}`))}>Get by id</button>
          <input className="border px-2 py-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artworks/search", () => fetch(`${API_BASE_URL}/artworks/search?title=${encodeURIComponent(title)}`))}>Search</button>
          <input className="border px-2 py-1 w-24" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="min" />
          <input className="border px-2 py-1 w-24" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="max" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artworks/price-range", () => fetch(`${API_BASE_URL}/artworks/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`))}>Price range</button>
          <input className="border px-2 py-1 w-24" value={artistId} onChange={(e) => setArtistId(e.target.value)} placeholder="artistId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artworks/artist/{artistId}", () => fetch(`${API_BASE_URL}/artworks/artist/${artistId}`))}>By artist</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Auth</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="border px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          <input className="border px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input className="border px-2 py-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <button className="px-3 py-1 border rounded" onClick={() => run("POST /auth/register", () => fetch(`${API_BASE_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password, userType: "CUSTOMER" }) }))}>Register</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("POST /auth/login (expects username)", () => fetch(`${API_BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }))}>Login</button>
        </div>
        <p className="text-xs text-gray-500">Note: Backend login expects username, but some frontend code sends email.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Artists</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="border px-2 py-1 w-24" value={profileId} onChange={(e) => setProfileId(e.target.value)} placeholder="profileId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artists/profile/{id}", () => fetch(`${API_BASE_URL}/artists/profile/${profileId}`))}>Get profile</button>
          <input className="border px-2 py-1 w-24" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /artists/profile/user/{userId}", () => fetch(`${API_BASE_URL}/artists/profile/user/${userId}`))}>Get by user</button>
          <input className="border px-2 py-1" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="bio" />
          <button className="px-3 py-1 border rounded" onClick={() => run("POST /artists/profile/{userId}", () => fetch(`${API_BASE_URL}/artists/profile/${userId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bio }) }))}>Create profile</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("PUT /artists/profile/{id}", () => fetch(`${API_BASE_URL}/artists/profile/${profileId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bio }) }))}>Update profile</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Users</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="border px-2 py-1 w-24" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /users/{id}", () => fetch(`${API_BASE_URL}/users/${userId}`))}>Get by id</button>
          <input className="border px-2 py-1" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /users/username/{username}", () => fetch(`${API_BASE_URL}/users/username/${encodeURIComponent(username)}`))}>By username</button>
          <input className="border px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /users/email/{email}", () => fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`))}>By email</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Cart & Orders</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="border px-2 py-1 w-24" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="userId" />
          <input className="border px-2 py-1 w-24" value={artworkId} onChange={(e) => setArtworkId(e.target.value)} placeholder="artworkId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("POST /shopping/cart/add", () => fetch(`${API_BASE_URL}/shopping/cart/add?userId=${userId}&artworkId=${artworkId}&quantity=1`, { method: "POST" }))}>Add to cart</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /shopping/cart/{userId}", () => fetch(`${API_BASE_URL}/shopping/cart/${userId}`))}>Get cart</button>
          <input className="border px-2 py-1 w-24" value={cartItemId} onChange={(e) => setCartItemId(e.target.value)} placeholder="cartItemId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("DELETE /shopping/cart/{cartItemId}", () => fetch(`${API_BASE_URL}/shopping/cart/${cartItemId}`, { method: "DELETE" }))}>Remove item</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("DELETE /shopping/cart/clear/{userId}", () => fetch(`${API_BASE_URL}/shopping/cart/clear/${userId}`, { method: "DELETE" }))}>Clear cart</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("POST /shopping/order/create/{userId}", () => fetch(`${API_BASE_URL}/shopping/order/create/${userId}`, { method: "POST" }))}>Create order</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /shopping/orders/{userId}", () => fetch(`${API_BASE_URL}/shopping/orders/${userId}`))}>My orders</button>
          <input className="border px-2 py-1 w-24" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="orderId" />
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /shopping/order/{orderId}", () => fetch(`${API_BASE_URL}/shopping/order/${orderId}`))}>Order by id</button>
          <input className="border px-2 py-1 w-32" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} placeholder="status" />
          <button className="px-3 py-1 border rounded" onClick={() => run("PUT /shopping/order/{orderId}/status", () => fetch(`${API_BASE_URL}/shopping/order/${orderId}/status?status=${encodeURIComponent(orderStatus)}`, { method: "PUT" }))}>Update status</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Admin</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <button className="px-3 py-1 border rounded" onClick={() => run("GET /admin/orders (requires ADMIN role)", () => fetch(`${API_BASE_URL}/admin/orders`))}>All orders</button>
          <button className="px-3 py-1 border rounded" onClick={() => run("PUT /admin/orders/{orderId}/status (requires ADMIN role)", () => fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?status=${encodeURIComponent(orderStatus)}`, { method: "PUT" }))}>Admin update status</button>
        </div>
        <p className="text-xs text-gray-500">Note: These require ADMIN role; backend uses role checks without session/JWT, so these likely 401/403.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Output</h2>
        {status && <div className="text-sm text-blue-600">{status}</div>}
        <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">
{JSON.stringify(output, null, 2)}
        </pre>
      </section>
    </div>
  )
}


