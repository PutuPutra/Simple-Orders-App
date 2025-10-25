import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createOrder, getOrdersByUserId } from "@/lib/orders";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrdersByUserId(user.id);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(" Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });
    }

    const order = await createOrder(user.id, productId, quantity);

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order. Check product availability." },
        { status: 400 }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
