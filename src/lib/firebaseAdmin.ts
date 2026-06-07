// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`,
    });
  } else {
    // Fallback for local development using the credential file from parent directory
    try {
      const fs = require('fs');
      const path = require('path');
      const credentialsPath = path.resolve(process.cwd(), '../krx-modern-dev-firebase-adminsdk-fbsvc-04b7ecbac8.json');
      
      if (fs.existsSync(credentialsPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://krx-modern-dev-default-rtdb.asia-southeast1.firebasedatabase.app',
        });
      } else {
        console.warn('Firebase Admin credentials file not found at:', credentialsPath);
      }
    } catch (error) {
      console.warn('Firebase Admin credentials not found in environment or fallback file.', error);
    }
  }
}

const db = getDatabase();
export { admin, db };
