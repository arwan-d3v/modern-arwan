const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Callable function to validate that the authenticated user has a required role.
 * Expects data: { requiredRole: string }
 */
exports.validateUserRole = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const requiredRole = data?.requiredRole;
  if (!requiredRole) {
    throw new functions.https.HttpsError('invalid-argument', 'requiredRole not provided');
  }

  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User document not found');
  }

  const userRole = userDoc.data()?.role;
  const allowed = userRole === requiredRole || userRole === 'SUPER_USER';
  if (!allowed) {
    throw new functions.https.HttpsError('permission-denied', `Role ${requiredRole} required`);
  }
  return { allowed: true, role: userRole };
});
