import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

const products = [
  {
    id: "1",
    name: "Laptop",
    price: 999.99,
    stock: 15,
  },
  {
    id: "2",
    name: "Wireless Mouse",
    price: 29.99,
    stock: 50,
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    price: 149.99,
    stock: 30,
  },
  {
    id: "4",
    name: "USB-C Hub",
    price: 49.99,
    stock: 25,
  },
  {
    id: "5",
    name: "Monitor 27 inch",
    price: 299.99,
    stock: 10,
  },
];

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Clear existing products
    await db.collection("products").deleteMany({});
    console.log("Cleared existing products");

    // Insert products
    const result = await db.collection("products").insertMany(products);
    console.log(`Inserted ${result.insertedCount} products`);

    // Create indexes
    await db.collection("products").createIndex({ id: 1 }, { unique: true });
    await db.collection("orders").createIndex({ userId: 1 });
    await db.collection("orders").createIndex({ id: 1 }, { unique: true });
    console.log("Created indexes");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
