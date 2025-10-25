"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/lib/products";

interface CreateOrderFormProps {
  selectedProduct: Product | null;
  onOrderCreated: () => void;
}

export function CreateOrderForm({ selectedProduct, onOrderCreated }: CreateOrderFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(" Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
      setQuantity(1);
    }
  }, [selectedProduct]);

  const selectedProductData = products.find((p) => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create order");
        return;
      }

      setSuccess("Order created successfully!");
      setProductId("");
      setQuantity(1);

      setTimeout(() => {
        onOrderCreated();
      }, 1000);
    } catch (err) {
      console.error(" Order creation error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Select a product and quantity to place an order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={productId} onValueChange={setProductId} required>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                    {product.name} - ${product.price.toFixed(2)} ({product.stock} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProductData?.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            {selectedProductData && (
              <p className="text-sm text-muted-foreground">
                Available stock: {selectedProductData.stock} | Max quantity:{" "}
                {selectedProductData.stock}
              </p>
            )}
          </div>

          {selectedProductData && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Order Summary</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-medium">{selectedProductData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span>${selectedProductData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total:</span>
                  <span>${(selectedProductData.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading || !productId}>
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
