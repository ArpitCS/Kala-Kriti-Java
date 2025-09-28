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
import { ArrowLeft, Search, MoreHorizontal, Eye, Package, Truck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Order {
  id: number
  customerName: string
  customerEmail: string
  artistName: string
  productName: string
  quantity: number
  total: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  orderDate: string
  shippingAddress: string
}

export default function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, searchTerm, statusFilter, paymentFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        status: statusFilter === "ALL" ? "" : statusFilter,
        paymentStatus: paymentFilter === "ALL" ? "" : paymentFilter,
      })

      const response = await api.get(`/admin/orders?${params}`)
      setOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      fetchOrders() // Refresh the list
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "outline"
      case "PROCESSING":
        return "secondary"
      case "SHIPPED":
        return "default"
      case "DELIVERED":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "outline"
      case "FAILED":
        return "destructive"
      case "REFUNDED":
        return "secondary"
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
              <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
              <p className="text-muted-foreground mt-1">Manage all orders and their fulfillment</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and manage all orders placed on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Payments</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders Table */}
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
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              <div className="text-muted-foreground">No orders found matching your criteria</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-foreground">{order.customerName}</div>
                                  <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-foreground line-clamp-1">{order.productName}</div>
                                  <div className="text-sm text-muted-foreground">Qty: {order.quantity}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{order.artistName}</TableCell>
                              <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
                                  {order.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/orders/${order.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    {order.status === "PENDING" && (
                                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, "PROCESSING")}>
                                        <Package className="mr-2 h-4 w-4" />
                                        Start Processing
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === "PROCESSING" && (
                                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, "SHIPPED")}>
                                        <Truck className="mr-2 h-4 w-4" />
                                        Mark as Shipped
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === "SHIPPED" && (
                                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, "DELIVERED")}>
                                        Mark as Delivered
                                      </DropdownMenuItem>
                                    )}
                                    {(order.status === "PENDING" || order.status === "PROCESSING") && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                        className="text-red-600"
                                      >
                                        Cancel Order
                                      </DropdownMenuItem>
                                    )}
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
