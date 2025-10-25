"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { CreateOrderForm } from "@/components/create-order-form"
import { OrderHistory } from "@/components/order-history"
import type { Product } from "@/lib/products"

export function DashboardContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("products")
  const [refreshOrders, setRefreshOrders] = useState(0)

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setActiveTab("create-order")
  }

  const handleOrderCreated = () => {
    setSelectedProduct(null)
    setActiveTab("orders")
    setRefreshOrders((prev) => prev + 1)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="create-order">Create Order</TabsTrigger>
        <TabsTrigger value="orders">Order History</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Products</h2>
          <ProductList onSelectProduct={handleSelectProduct} />
        </div>
      </TabsContent>

      <TabsContent value="create-order" className="mt-6">
        <CreateOrderForm selectedProduct={selectedProduct} onOrderCreated={handleOrderCreated} />
      </TabsContent>

      <TabsContent value="orders" className="mt-6">
        <OrderHistory key={refreshOrders} />
      </TabsContent>
    </Tabs>
  )
}
