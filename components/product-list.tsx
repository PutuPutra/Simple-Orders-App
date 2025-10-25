"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/products";

export function ProductList({ onSelectProduct }: { onSelectProduct: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
          credentials: "include",
        });
        console.debug("GET /api/products status:", response.status);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Silakan login.");
          } else {
            setError(data?.error ?? "Failed to load products");
          }
          setProducts([]);
          return;
        }
        console.debug("Products data:", data);

        // pastikan products ada dan normalisasi id jika perlu
        const productsFromApi: Product[] = (data.products ?? []).map((p: any) => ({
          id: p.id ?? (p._id ? String(p._id) : ""),
          name: String(p.name ?? ""),
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
          _id: undefined,
        }));

        setProducts(productsFromApi);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Fetch products failed:", err);
          setError("Gagal mengambil data produk");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelectProduct(product)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge
                variant={
                  product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"
                }
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
            <CardDescription className="text-2xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Click to create an order</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
