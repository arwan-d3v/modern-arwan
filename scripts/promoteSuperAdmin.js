// scripts/promoteSuperAdmin.js
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://krx-modern-dev-default-rtdb.asia-southeast1.firebasedatabase.app',
  });
}

// Initialize Realtime Database instance using Admin SDK
const db = admin.database();

(async () => {
  try {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');
    if (!snapshot.exists()) {
      console.log('No users found');
      return;
    }
    const users = snapshot.val();
    for (const uid in users) {
      const user = users[uid];
      if (user.email && user.email.includes('admin@krx.com')) {
        console.log(`Promoting ${uid} (${user.email}) → super_admin`);
        await db.ref(`users/${uid}`).update({ role: 'super_admin' });
      }
    }
    console.log('Promotion complete');
  } catch (err) {
    console.error('Error promoting super admin', err);
  }
})();
