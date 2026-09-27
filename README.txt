=====================================
  SNOWEEY · PRIVATE ADMIN ACCESS
=====================================

HOW TO ACCESS THE DASHBOARD:

METHOD 1 — Secret gesture:
  Triple-click/tap the "snoweey" logo (within 600ms).

METHOD 2 — Keyboard shortcut:
  Ctrl + Shift + Alt + A

-------------------------------------
LOGIN
-------------------------------------
  Use the Firebase Authentication account you created.
  Sign up via the admin page's "sign up" tab on first use,
  then sign in with those credentials.

-------------------------------------
REQUIRED ONE-TIME SETUP (Firebase Console)
-------------------------------------
  1. Authentication → Sign-in method → Enable Email/Password.
  2. Firestore Database → Rules → paste:

     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /products/{id} {
           allow read: if true;
           allow write: if request.auth != null;
         }
       }
     }

-------------------------------------
WHAT THE DASHBOARD DOES
-------------------------------------
  ✓ Add / edit / delete products
  ✓ Upload images (stored in Netlify Blobs)
  ✓ Products appear instantly on the homepage

-------------------------------------
DEPLOYMENT CHECKLIST
-------------------------------------
  ✓ upload.js and image.js must live in netlify/functions/
  ✓ package.json must contain "type": "module"
  ✓ netlify.toml must contain the /api/* redirects
  ✓ Deploy via Git or `netlify deploy --prod`
=====================================