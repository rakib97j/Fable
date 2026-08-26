"use server"

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTH_DB_NAME || "fable_db";

export async function getRandomWriters() {
  try {
    if (!uri) return { success: false, data: [] };

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    let usersCollection = db.collection("users");
    let count = await usersCollection.countDocuments({ role: "writer" });
    if (count === 0) {
      const altCollection = db.collection("user");
      const altCount = await altCollection.countDocuments({ role: "writer" });
      if (altCount > 0) {
        usersCollection = altCollection;
      }
    }

    const writers = await usersCollection
      .aggregate([
        { $match: { role: "writer" } },
        { $sample: { size: 3 } },
        {
          $lookup: {
            from: "e-books",
            localField: "email",
            foreignField: "writerEmail",
            as: "publishedBooks1",
          },
        },
        {
          $lookup: {
            from: "ebooks",
            localField: "email",
            foreignField: "writerEmail",
            as: "publishedBooks2",
          },
        },
      ])
      .toArray();

    await client.close();

    const serialized = writers.map((w) => {
      const b1 = Array.isArray(w.publishedBooks1) ? w.publishedBooks1 : [];
      const b2 = Array.isArray(w.publishedBooks2) ? w.publishedBooks2 : [];
      const totalPublished = Math.max(b1.length, b2.length, w.publishedCount || 0);

      delete w.publishedBooks1;
      delete w.publishedBooks2;

      return {
        ...w,
        _id: w._id ? String(w._id) : undefined,
        publishedCount: totalPublished,
      };
    });

    return { success: true, data: serialized };
  } catch (error) {
    console.error("Error in getRandomWriters server action:", error);
    return { success: false, data: [] };
  }
}

export async function getAllWriters() {
  try {
    if (!uri) return { success: false, data: [] };

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    let usersCollection = db.collection("users");
    let count = await usersCollection.countDocuments({ role: "writer" });
    if (count === 0) {
      const altCollection = db.collection("user");
      const altCount = await altCollection.countDocuments({ role: "writer" });
      if (altCount > 0) {
        usersCollection = altCollection;
      }
    }

    const writers = await usersCollection
      .aggregate([
        { $match: { role: "writer" } },
        {
          $lookup: {
            from: "e-books",
            localField: "email",
            foreignField: "writerEmail",
            as: "publishedBooks1",
          },
        },
        {
          $lookup: {
            from: "ebooks",
            localField: "email",
            foreignField: "writerEmail",
            as: "publishedBooks2",
          },
        },
      ])
      .toArray();

    await client.close();

    const serialized = writers.map((w) => {
      const b1 = Array.isArray(w.publishedBooks1) ? w.publishedBooks1 : [];
      const b2 = Array.isArray(w.publishedBooks2) ? w.publishedBooks2 : [];
      const totalPublished = Math.max(b1.length, b2.length, w.publishedCount || 0);

      delete w.publishedBooks1;
      delete w.publishedBooks2;

      return {
        ...w,
        _id: w._id ? String(w._id) : undefined,
        publishedCount: totalPublished,
      };
    });

    return { success: true, data: serialized };
  } catch (error) {
    console.error("Error in getAllWriters server action:", error);
    return { success: false, data: [] };
  }
}

export async function getWriterDetails(id) {
  try {
    if (!uri || !id) return { success: false, message: "Invalid writer ID", data: null };

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    let usersCollection = db.collection("users");
    let count = await usersCollection.countDocuments({ role: "writer" });
    if (count === 0) {
      const altCollection = db.collection("user");
      const altCount = await altCollection.countDocuments({ role: "writer" });
      if (altCount > 0) {
        usersCollection = altCollection;
      }
    }

    const { ObjectId } = await import("mongodb");
    const decodedId = decodeURIComponent(id);
    const matchStage = ObjectId.isValid(decodedId)
      ? { $match: { $or: [{ _id: new ObjectId(decodedId) }, { _id: decodedId }, { id: decodedId }, { email: decodedId }, { name: decodedId }], role: "writer" } }
      : { $match: { $or: [{ _id: decodedId }, { id: decodedId }, { email: decodedId }, { name: decodedId }], role: "writer" } };

    const result = await usersCollection
      .aggregate([
        matchStage,
        {
          $lookup: {
            from: "e-books",
            localField: "email",
            foreignField: "writerEmail",
            as: "publishedBooks",
          },
        },
      ])
      .toArray();

    if (result.length > 0 && (!result[0].publishedBooks || result[0].publishedBooks.length === 0)) {
      const ebooksCol = db.collection("ebooks");
      const altBooks = await ebooksCol.find({ writerEmail: result[0].email }).toArray();
      if (altBooks.length > 0) {
        result[0].publishedBooks = altBooks;
      }
    }

    await client.close();

    if (!result || result.length === 0) {
      return { success: false, message: "Writer not found", data: null };
    }

    const writer = result[0];

    const serializeObj = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      if (Array.isArray(obj)) return obj.map(serializeObj);
      const newObj = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === "_id" && v) {
          newObj[k] = String(v);
        } else if (v && typeof v === "object" && v._bsontype === "ObjectID") {
          newObj[k] = String(v);
        } else if (v instanceof Date) {
          newObj[k] = v.toISOString();
        } else if (v && typeof v === "object") {
          newObj[k] = serializeObj(v);
        } else {
          newObj[k] = v;
        }
      }
      return newObj;
    };

    return { success: true, data: serializeObj(writer) };
  } catch (error) {
    console.error("Error in getWriterDetails server action:", error);
    return { success: false, message: error.message, data: null };
  }
}
