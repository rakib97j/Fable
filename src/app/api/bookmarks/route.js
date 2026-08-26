import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function POST(req) {
  try {
    if (!uri) {
      return NextResponse.json(
        { message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const { userId, book } = await req.json();

    if (!userId || !book || (!book._id && !book.id)) {
      return NextResponse.json(
        { message: "Invalid request payload. userId and book object are required." },
        { status: 400 }
      );
    }

    const bookIdStr = String(book._id || book.id);

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const bookmarkCollection = db.collection("bookmarks");

    // Check if user already bookmarked this book
    const existingBookmark = await bookmarkCollection.findOne({
      userId: userId,
      bookId: bookIdStr,
    });

    if (existingBookmark) {
      await client.close();
      return NextResponse.json(
        { message: "Already bookmarked!" },
        { status: 400 }
      );
    }

    const newBookmark = {
      userId: userId,
      bookId: bookIdStr,
      title: book.title || "Untitled",
      writerName: book.writerName || book.author || "Unknown Author",
      coverImage: book.coverImage || "",
      genre: book.genre || "General",
      price: typeof book.price === "number" ? book.price : parseFloat(book.price) || 0,
      isFree: Boolean(book.isFree || book.price === 0),
      createdAt: new Date().toISOString(),
    };

    const result = await bookmarkCollection.insertOne(newBookmark);
    await client.close();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    if (!uri) {
      return NextResponse.json(
        { message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const bookmarkCollection = db.collection("bookmarks");

    const userBookmarks = await bookmarkCollection
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return NextResponse.json(userBookmarks, { status: 200 });
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    if (!uri) {
      return NextResponse.json(
        { message: "Database connection string missing" },
        { status: 500 }
      );
    }

    let userId = null;
    let bookId = null;

    // Check request body first (if present)
    try {
      const body = await req.json();
      userId = body?.userId;
      bookId = body?.bookId;
    } catch (e) {
      // Body not present or unparseable, fallback to searchParams
    }

    if (!userId || !bookId) {
      const { searchParams } = new URL(req.url);
      userId = userId || searchParams.get("userId");
      bookId = bookId || searchParams.get("bookId");
    }

    if (!userId || !bookId) {
      return NextResponse.json(
        { message: "userId and bookId are required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const bookmarkCollection = db.collection("bookmarks");

    const query = { userId: userId, bookId: String(bookId) };
    const result = await bookmarkCollection.deleteOne(query);

    await client.close();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
