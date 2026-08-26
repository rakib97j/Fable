import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function GET(req, { params }) {
  try {
    if (!uri) {
      return NextResponse.json(
        { message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "userId parameter is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const bookmarkCollection = db.collection("bookmarks");

    const result = await bookmarkCollection
      .find({ userId: userId })
      .toArray();

    await client.close();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("GET /api/bookmarks/:userId error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch user bookmarks" },
      { status: 500 }
    );
  }
}
