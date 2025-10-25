import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllProducts } from "@/lib/products";

export async function GET() {
  try {
    let user;
    try {
      user = await getSession();
    } catch (err) {
      console.error("getSession failed:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let products;
    try {
      products = await getAllProducts();
    } catch (err) {
      console.error("getAllProducts failed:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // defensive serialization (ObjectId -> string)
    const serialized = (products ?? []).map((p: any) => ({
      id: p.id ?? (p._id ? String(p._id) : null),
      name: p?.name ?? "",
      price: typeof p?.price === "number" ? p.price : Number(p?.price ?? 0),
      stock: typeof p?.stock === "number" ? p.stock : Number(p?.stock ?? 0),
    }));

    console.log(`Returning ${serialized.length} products`);
    return NextResponse.json({ products: serialized });
  } catch (error) {
    console.error("Unexpected products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
