"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authenticatedFetch } from "@/lib/authenticated-fetch"

interface UserRow {
  id: number
  username: string
  email: string
  userType: string
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await authenticatedFetch("http://localhost:8080/api/admin/users")
      if (!res.ok) {
        throw new Error(`Failed to fetch users (${res.status})`)
      }
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">User Management</h1>
              <p className="text-muted-foreground">View and manage platform users</p>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-medium">Users ({users.length})</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/admin">Back to Dashboard</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 rounded-md border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {loading ? (
                  <div className="py-10 text-center text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">No users found.</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.id}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                              <Badge variant={u.userType === "ADMIN" ? "default" : u.userType === "ARTIST" ? "secondary" : "outline"}>
                                {u.userType}
                              </Badge>
                            </TableCell>
                            <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
