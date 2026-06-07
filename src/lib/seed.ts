import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const seedInitialData = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

  // Seed metrics if needed
  // This is just a helper, I'll call it if I detect empty db
};
