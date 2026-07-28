// pages/api/admin/updateRole.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, db as adminDb } from '@/lib/firebaseAdmin';

/**
 * POST /api/admin/updateRole
 * Body: { uid: string; role: 'super_admin' | 'user' | 'guest' }
 * Only super_admin should call this endpoint.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { uid, role } = req.body as { uid?: string; role?: string };
  if (!uid || !role) {
    return res.status(400).json({ error: 'uid and role are required' });
  }
  if (!['super_admin', 'family', 'pro', 'student', 'guest', 'public'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if the requester has super_admin role in RTDB
    const requesterRef = adminDb.ref(`users/${decodedToken.uid}`);
    const requesterSnap = await requesterRef.once('value');
    if (!requesterSnap.exists() || requesterSnap.val().role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await adminDb.ref(`users/${uid}`).update({ role });
    return res.status(200).json({ message: 'Role updated' });
  } catch (error: any) {
    console.error('Update role error', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
