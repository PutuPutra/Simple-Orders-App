import { getDatabase } from "./mongodb";
import type { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  price: number;
  stock: number;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>("products").find({}).toArray();
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase();
  const product = await db.collection<Product>("products").findOne({ id });
  return product;
}

export async function updateProductStock(id: string, quantity: number): Promise<boolean> {
  const db = await getDatabase();
  const product = await getProductById(id);

  if (!product || product.stock < quantity) {
    return false;
  }

  const result = await db
    .collection<Product>("products")
    .updateOne({ id }, { $inc: { stock: -quantity } });

  return result.modifiedCount > 0;
}
