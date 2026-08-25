import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role is required" },
        { status: 400 }
      );
    }

    if (!uri) {
      return NextResponse.json(
        { success: false, message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Build filter matching ObjectId or string ID
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const updatedDoc = {
      $set: {
        role: role,
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await usersCollection.updateOne(filter, updatedDoc);
    await client.close();

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("API PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!uri) {
      return NextResponse.json(
        { success: false, message: "Database connection string missing" },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const result = await usersCollection.deleteOne(query);
    await client.close();

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("API DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

