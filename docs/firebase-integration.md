# Firebase Integration Guide

This document outlines the steps to configure Firebase for the Personal Command Center project, ensuring proper authentication, data structure, and security enforcement.

## 1. Initial Setup

1.  **Create Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click **Add project** and follow the prompts.
2.  **Register Web App:**
    - In your project overview, click the **Web icon (</>)**.
    - Enter an app nickname (e.g., `command-center-web`) and click **Register app**.
    - Copy the `firebaseConfig` object for use in your environment variables.

## 2. Authentication

1.  Navigate to **Authentication** in the Firebase sidebar.
2.  Click **Get Started**.
3.  Go to the **Sign-in method** tab.
4.  Click **Add new provider** and select **Google**.
5.  Enable the provider, select a support email, and click **Save**.

## 3. Firestore Structure & RBAC

The application uses Firestore to manage users and content.

### Collections Schema

- **`users`**
  - `uid`: string (Document ID)
  - `email`: string
  - `displayName`: string
  - `role`: string ('SUPER_USER' | 'FAMILY' | 'GUEST')
  - `createdAt`: serverTimestamp
- **`work_experience`**
  - `type`: string ('formal' | 'freelance')
  - `title`: string
  - `company`: string
  - `dates`: string
  - `description`: string
- **`showcase_projects`**
  - `title`: string
  - `tech_stack`: array (strings)
  - `description`: string
  - `image_url`: string
  - `live_link`: string
- **`skills_matrix`**
  - `category`: string
  - `skills`: array (strings)

### Manual Role Elevation

By default, every new user is assigned the `'GUEST'` role. To elevate your own user to `'SUPER_USER'`:
1. Login to the application once.
2. Open the **Firebase Console > Firestore Database**.
3. Find your user document in the `users` collection.
4. Change the `role` field value from `'GUEST'` to `'SUPER_USER'`.

## 4. Firestore Security Rules (CRITICAL)

Paste the following rules into the **Rules** tab of your Firestore Database to enforce Role-Based Access Control:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check user role
    function isSuperUser() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'SUPER_USER';
    }

    // User Profile Rules
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public Portfolio Content Rules
    match /work_experience/{docId} {
      allow read: if true;
      allow create, update, delete: if isSuperUser();
    }

    match /showcase_projects/{docId} {
      allow read: if true;
      allow create, update, delete: if isSuperUser();
    }

    match /skills_matrix/{docId} {
      allow read: if true;
      allow create, update, delete: if isSuperUser();
    }

    // Fallback
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 5. Environment Variables

Create a `.env.local` file in your root directory and populate it with your Firebase project credentials:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
