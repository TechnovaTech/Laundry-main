import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
  var _mongoClientPromise: Promise<MongoClient>
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((result) => {
      return result.connection.getClient() as any
    }) as any
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// MongoDB native client connection for notifications API
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db('laundry')
  return { client, db }
}

export default dbConnect