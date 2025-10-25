import { getDatabase } from "./mongodb";
import { getProductById, updateProductStock } from "./products";
import type { ObjectId } from "mongodb";

export interface Order {
  _id?: ObjectId;
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  status: "pending" | "completed" | "cancelled";
}

export async function createOrder(
  userId: string,
  productId: string,
  quantity: number
): Promise<Order | null> {
  const product = await getProductById(productId);

  if (!product) {
    return null;
  }

  if (product.stock < quantity) {
    return null;
  }

  // Update product stock
  const stockUpdated = await updateProductStock(productId, quantity);
  if (!stockUpdated) {
    return null;
  }

  const db = await getDatabase();

  // Generate order ID
  const orderCount = await db.collection("orders").countDocuments();
  const orderId = String(orderCount + 1);

  const order: Order = {
    id: orderId,
    userId,
    productId,
    productName: product.name,
    quantity,
    totalPrice: product.price * quantity,
    createdAt: new Date(),
    status: "completed",
  };

  await db.collection<Order>("orders").insertOne(order);

  return order;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const db = await getDatabase();
  const orders = await db
    .collection<Order>("orders")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDatabase();
  const order = await db.collection<Order>("orders").findOne({ id });
  return order;
}
