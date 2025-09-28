"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { api } from "@/lib/api"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Search, MoreHorizontal, Eye, Trash2, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Product {
  id: number
  name: string
  artistName: string
  category: string
  price: number
  stock: number
  status: "ACTIVE" | "INACTIVE" | "PENDING_APPROVAL"
  views: number
  sales: number
  createdAt: string
  imageUrl: string
}

export default function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    "PAINTING",
    "SCULPTURE",
    "PHOTOGRAPHY",
    "DIGITAL_ART",
    "DRAWING",
    "MIXED_MEDIA",
    "PRINTS",
    "CRAFTS",
  ]

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, categoryFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        category: categoryFilter === "ALL" ? "" : categoryFilter,
        status: statusFilter === "ALL" ? "" : statusFilter,
      })

      const response = await api.get(`/admin/products?${params}`)
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (productId: number, newStatus: string) => {
    try {
      await api.put(`/admin/products/${productId}/status`, { status: newStatus })
      fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Failed to update product status:", error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      await api.delete(`/admin/products/${productId}`)
      fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "PENDING_APPROVAL":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
              <p className="text-muted-foreground mt-1">Manage all products on the platform</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>View and manage all products listed on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Table */}
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
                          <TableHead>Product</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              <div className="text-muted-foreground">No products found matching your criteria</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      product.imageUrl ||
                                      `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(product.name)}`
                                    }
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <div>
                                    <div className="font-medium text-foreground line-clamp-1">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{product.artistName}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{product.category.replace("_", " ")}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">${product.price}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className={product.stock <= 5 ? "text-red-600" : ""}>{product.stock}</span>
                                  {product.stock <= 5 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(product.status)}>
                                  {product.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{product.views}</TableCell>
                              <TableCell className="text-sm">{product.sales}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/products/${product.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Product
                                      </Link>
                                    </DropdownMenuItem>
                                    {product.status === "PENDING_APPROVAL" && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(product.id, "ACTIVE")}
                                        className="text-green-600"
                                      >
                                        Approve Product
                                      </DropdownMenuItem>
                                    )}
                                    {product.status === "ACTIVE" ? (
                                      <DropdownMenuItem onClick={() => handleStatusChange(product.id, "INACTIVE")}>
                                        Deactivate
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleStatusChange(product.id, "ACTIVE")}>
                                        Activate
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Product
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
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
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
      </div>
    </ProtectedRoute>
  )
}
