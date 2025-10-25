"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/orders";

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(" Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No orders yet. Create your first order!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <CardDescription>{new Date(order.createdAt).toLocaleString()}</CardDescription>
                </div>
                <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium">{order.productName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Total Price:</span>
                  <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
