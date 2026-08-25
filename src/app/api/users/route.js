import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function GET() {
  try {
    if (!uri) {
      return NextResponse.json(
        { success: false, message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Fetch users with role in ["reader", "writer"] or all users
    const usersCollection = db.collection("users");
    const result = await usersCollection
      .find({
        role: { $in: ["reader", "writer"] },
      })
      .toArray();

    await client.close();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
