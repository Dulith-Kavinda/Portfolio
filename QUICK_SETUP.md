# Quick Setup Guide - Admin Panel

## Step 1: Install Dependencies
Your dependencies are already installed, but if you need to reinstall:
```bash
npm install
```

## Step 2: Firebase Setup

### Create Admin User
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Users**
4. Click **Add User**
5. Enter email and password for admin account
6. Click **Add User**

### Configure Firestore Collections
1. Go to **Firestore Database**
2. Create the following collections if they don't exist:
   - `posts` - For blog posts
   - `homeData` - For homepage sections
   - `feedback` - For user feedback

### Security Rules (Important!)
1. Go to **Firestore Database** > **Rules**
2. Update with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts - Public read, authenticated write
    match /posts/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Home Data - Public read, authenticated write
    match /homeData/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Feedback - Authenticated users only
    match /feedback/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 3: Environment Variables
Your `.env` file should have:
```env
VITE_REACT_APP_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGIN_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
VITE_MEISUREMENT_ID=your_measurement_id
```

## Step 4: Run the Application
```bash
npm run dev
```

## Step 5: Access Admin Panel
1. Open browser to: `http://localhost:5173/admin/login`
2. Enter your admin credentials
3. You're in! 🎉

## Admin Panel URLs
- **Login:** `/admin/login`
- **Dashboard:** `/admin`
- **Posts:** `/admin/posts`
- **Home Data:** `/admin/home-data`
- **Feedback:** `/admin/feedback`
- **Analytics:** `/admin/analytics`

## Quick Tips

### Creating Your First Post
1. Go to **Posts Management**
2. Click **Create Post**
3. Fill in:
   - Title
   - Description
   - Tags (comma-separated)
   - Image URL
   - Content
4. Check **Publish immediately**
5. Click **Create**

### Managing Home Sections
1. Go to **Home Data**
2. Click **Add Section**
3. Enter:
   - Section ID (number)
   - Type (Hero, Feature, etc.)
   - Title and Description
   - Optional Image URL
4. Click **Create**

### Viewing Feedback
1. Go to **Feedback**
2. Filter by status (Unread, Read, Resolved)
3. Click **View Details** to see full feedback
4. Update status as needed
5. Delete when resolved

## Troubleshooting

### Can't Login?
- ✅ Check if admin user exists in Firebase Console
- ✅ Verify email/password authentication is enabled
- ✅ Check browser console for errors

### Data Not Showing?
- ✅ Verify Firestore collections exist
- ✅ Check security rules are published
- ✅ Look for errors in browser console

### Changes Not Saving?
- ✅ Confirm you're logged in
- ✅ Check Firestore security rules
- ✅ Verify internet connection

## Need Help?
Check the full documentation in `ADMIN_README.md`

---

**You're all set!** Start by creating some posts and managing your content. 🚀
