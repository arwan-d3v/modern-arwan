// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, db as adminDb } from '@/lib/firebaseAdmin';

/**
 * POST /api/auth/register
 * Body: { uid: string; email: string | null; displayName?: string; photoURL?: string }
 * Creates a user profile with role "user" if it does not exist.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { uid, email, displayName, photoURL } = req.body;
  if (!uid) {
    return res.status(400).json({ error: 'uid is required' });
  }
  try {
    const userRef = adminDb.ref(`users/${uid}`);
    const snapshot = await userRef.once('value');
    if (snapshot.exists()) {
      // already exists – nothing to do
      return res.status(200).json({ message: 'User already exists' });
    }
    const newProfile = {
      uid,
      email: email || null,
      displayName: displayName || null,
      photoURL: photoURL || null,
      role: 'user',
      createdAt: Date.now(),
    };
    await userRef.set(newProfile);
    return res.status(201).json({ message: 'User created' });
  } catch (error: any) {
    console.error('Register error', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
