// scripts/listRBACUsers.js
// List existing RBAC users from Firebase Realtime Database using Firebase Admin SDK.
// The service account key is located at ./serviceAccountKey.json (project krx-modern-dev).

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Change this to the exact path in your Realtime Database where RBAC users are stored.
const DB_PATH = "/users"; // e.g. "/rbacUsers" or "/auth/users"

// Initialize the Firebase Admin app (only once).
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // The databaseURL must match your project. It can be inferred from the service account,
    // but explicit definition avoids ambiguous errors.
    databaseURL: "https://krx-modern-dev-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

const db = admin.database();

(async () => {
  try {
    // First, list top‑level keys to give you a sense of the DB structure.
    const rootRef = db.ref('/');
    const rootSnap = await rootRef.once('value');
    const topKeys = rootSnap.exists() ? Object.keys(rootSnap.val() || {}) : [];
    console.log('Top‑level keys in Realtime DB:', topKeys.length ? topKeys.join(', ') : '(none)');

    const targetRef = db.ref(DB_PATH);
    const snap = await targetRef.once('value');
    if (!snap.exists()) {
      console.log(`Path "${DB_PATH}" not found or contains no data.`);
      process.exit(0);
    }

    const data = snap.val();
    // Expecting an object where each child is a user record.
    const rows = [];
    rows.push('| UID | Email | Role |');
    rows.push('|-----|-------|------|');
    Object.entries(data).forEach(([uid, user]) => {
      const email = user.email || '-';
      const role = user.role || '-';
      rows.push(`| ${uid} | ${email} | ${role} |`);
    });
    console.log('\n' + rows.join('\n'));
  } catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
  }
})();
