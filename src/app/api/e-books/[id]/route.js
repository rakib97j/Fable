import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    if (!uri) {
      return NextResponse.json(
        { success: false, message: "Database not configured" },
        { status: 500 },
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Check in 'ebooks' or 'e-books' collections
    const collections = ["ebooks", "e-books"];
    let ebook = null;

    for (const colName of collections) {
      const col = db.collection(colName);

      // Try by ObjectId if valid
      if (ObjectId.isValid(id)) {
        ebook = await col.findOne({ _id: new ObjectId(id) });
      }

      // Try string ID if not found
      if (!ebook) {
        ebook = await col.findOne({ _id: id });
      }
      if (!ebook) {
        ebook = await col.findOne({ id: id });
      }

      if (ebook) break;
    }

    await client.close();

    if (!ebook) {
      return NextResponse.json(
        { success: false, message: "Ebook not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: ebook }, { status: 200 });
  } catch (error) {
    console.error("API GET /api/e-books/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
