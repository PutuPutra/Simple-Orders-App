import { MongoClient, type Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function initializeClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env file");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(process.env.MONGODB_URI, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDatabase(): Promise<Db> {
  const mongoClient = await initializeClient();
  return mongoClient.db(process.env.DATABASE_NAME || "simpleorder");
}

export async function getClientPromise(): Promise<MongoClient> {
  return initializeClient();
}
