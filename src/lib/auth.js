import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        }, 
    },
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "reader",
        required: false
      }
    }
  }
});
