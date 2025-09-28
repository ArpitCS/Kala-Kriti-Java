"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { api, type User } from "@/lib/api"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, MoreHorizontal, UserCheck, UserX, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      let response
      if (roleFilter === "ALL") {
        response = await api.getUsers({ page: currentPage, size: 10 })
      } else {
        response = await api.getUsersByRole(roleFilter as User["role"])
      }
      
      setUsers(response.data || [])
      setTotalPages(Math.ceil((response.data?.length || 0) / 10))
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = async (userId: number, updates: Partial<User>) => {
    try {
      await api.updateUser(userId, updates)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "ARTIST":
        return "default"
      case "CUSTOMER":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage platform users and their permissions</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="ARTIST">Artist</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              <div className="text-muted-foreground">No users found matching your criteria</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((userData) => (
                            <TableRow key={userData.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-foreground">{userData.firstName} {userData.lastName}</div>
                                  <div className="text-sm text-muted-foreground">{userData.email}</div>
                                  <div className="text-xs text-muted-foreground">@{userData.username}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getRoleBadgeVariant(userData.role)}>{userData.role}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(userData.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => window.open(`mailto:${userData.email}`)}>
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage + 1} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                          disabled={currentPage === totalPages - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
