// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '../../serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://krx-modern-dev-default-rtdb.asia-southeast1.firebasedatabase.app',
  });
}

const db = getDatabase();
export { admin, db };
