SAROJ LIBRARY — PUBLIC WEBSITE STARTER

This is a website project, not yet a live public URL. It uses Firebase so that:
- Anyone can view published Questions, Answers and PDFs.
- Only your Firebase admin account can add or delete them.
- PDFs are stored online, not just on your phone.

SETUP (one-time; easiest on a computer)
1. Open https://console.firebase.google.com/ and create a project named Saroj Library.
2. In Project settings > Your apps, add a Web app and copy its Firebase config into app.js.
3. In Authentication > Sign-in method, enable Email/Password.
4. In Authentication > Users, add your own admin email and a strong password. Copy that user's UID.
5. Replace PASTE_ADMIN_USER_UID in BOTH firestore.rules and storage.rules, and replace ADMIN_UID in app.js with the same UID.
6. Create a Firestore database. Open Rules and publish the contents of firestore.rules.
7. Open Storage, get started, then publish storage.rules.
8. Install Node.js and Firebase CLI on a computer, then in this folder run:
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   Choose the existing Saroj Library project; set public directory to "."; configure as single-page app: No.
   Then run: firebase deploy --only hosting
9. Firebase will give you a public website URL. Share that link.

IMPORTANT SECURITY
- Never share your Firebase admin password or UID.
- Do not publish until both Firestore and Storage rules contain your real admin UID.
- The Firebase web config is designed to be public; security comes from Authentication and the rules.
- This starter allows public reading and admin-only writing/deleting.
- Upload limit is 20 MB per PDF. You can change it in storage.rules.
