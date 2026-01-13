# Admin Panel Documentation

## Overview
A comprehensive admin panel for managing your portfolio website content, including posts, home data, feedback, and analytics.

## Features

### 🔐 Authentication
- Secure Firebase Authentication
- Protected admin routes
- Session management
- Automatic logout on session expiry

### 📊 Dashboard
- Overview statistics (Total Posts, Views, Feedback, Recent Activity)
- Quick action cards for common tasks
- Recent posts table
- Real-time data updates

### 📝 Posts Management
- Create, edit, and delete blog posts
- Rich post editor with:
  - Title and description
  - Tags management
  - Image URL support
  - Full content editor
  - Publish/Draft status
- Search and filter functionality
- Tag-based filtering
- Post preview with images

### 🏠 Home Data Management
- Manage homepage sections
- Section types: Hero, Feature, About, Service, General
- Visual card-based interface
- Image preview
- Easy CRUD operations

### 💬 Feedback Management
- View all user feedback
- Status management (Unread, Read, Resolved)
- Quick stats overview
- Detailed feedback viewer
- Delete functionality
- Filter by status

### 📈 Analytics Dashboard
- Page views tracking
- Visitor statistics (Total, Unique, Returning)
- Visual charts:
  - Page views trend (7-day chart)
  - Traffic sources breakdown
  - Device distribution
- Top performing posts
- Engagement metrics

## Getting Started

### Prerequisites
- Firebase project with Firestore enabled
- Firebase Authentication enabled (Email/Password)
- Environment variables configured

### Setup

1. **Configure Firebase Authentication:**
   ```
   - Go to Firebase Console
   - Enable Authentication > Email/Password
   - Create an admin user account
   ```

2. **Set up Firestore Collections:**
   ```
   Collections needed:
   - posts
   - homeData
   - feedback
   ```

3. **Environment Variables:**
   Ensure your `.env` file has:
   ```
   VITE_REACT_APP_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_auth_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGIN_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   VITE_MEISUREMENT_ID=your_measurement_id
   ```

### Accessing the Admin Panel

1. **Navigate to:** `http://localhost:5173/admin/login`

2. **Login with your admin credentials:**
   - Email: your-admin@email.com
   - Password: your-admin-password

3. **Admin Routes:**
   - `/admin` - Dashboard
   - `/admin/posts` - Posts Management
   - `/admin/home-data` - Home Data Management
   - `/admin/feedback` - Feedback Management
   - `/admin/analytics` - Analytics Dashboard

## File Structure

```
src/
├── Admin/
│   ├── AdminLayout.jsx       # Main admin layout with sidebar
│   ├── AdminLogin.jsx         # Login page
│   ├── AdminDashboard.jsx     # Dashboard overview
│   ├── AdminPosts.jsx         # Posts management
│   ├── AdminHomeData.jsx      # Home data management
│   ├── AdminFeedback.jsx      # Feedback management
│   └── AdminAnalytics.jsx     # Analytics dashboard
├── adminApi.jsx               # Admin API functions
└── main.jsx                   # Updated with admin routes
```

## API Functions

### Posts
- `getAdminPosts()` - Fetch all posts
- `createPost(postData)` - Create new post
- `updatePost(postId, postData)` - Update existing post
- `deletePost(postId)` - Delete post

### Home Data
- `getAdminHomeData()` - Fetch all home data
- `createHomeData(data)` - Create new section
- `updateHomeData(itemId, data)` - Update section
- `deleteHomeData(itemId)` - Delete section

### Feedback
- `getAdminFeedback()` - Fetch all feedback
- `updateFeedbackStatus(feedbackId, status)` - Update status
- `deleteFeedback(feedbackId)` - Delete feedback

### Analytics
- `getAnalyticsData()` - Fetch analytics data

## Security Features

1. **Route Protection:**
   - Admin routes require authentication
   - Automatic redirect to login if not authenticated
   - Session validation

2. **Firebase Security Rules:**
   Add these rules to your Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all users for posts and homeData
       match /posts/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /homeData/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       // Feedback requires authentication to read/write
       match /feedback/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## Customization

### Styling
The admin panel uses Tailwind CSS with a dark theme. Customize colors in the components:
- Primary: Blue (blue-500, blue-600)
- Secondary: Purple (purple-500, purple-600)
- Background: Gray (gray-800, gray-900)

### Adding New Features
1. Create new component in `src/Admin/`
2. Add API functions in `adminApi.jsx`
3. Add route in `main.jsx`
4. Add navigation link in `AdminLayout.jsx`

## Troubleshooting

### Login Issues
- Verify Firebase Authentication is enabled
- Check if email/password provider is active
- Confirm admin user exists in Firebase Console

### Data Not Loading
- Check Firestore collection names match exactly
- Verify Firebase configuration in `firebase.jsx`
- Check browser console for errors

### Permission Errors
- Review Firestore security rules
- Ensure authenticated user has proper permissions
- Check Firebase Console for security rule violations

## Best Practices

1. **Regular Backups:** Export Firestore data regularly
2. **Security:** Use strong passwords for admin accounts
3. **Monitoring:** Check analytics regularly for unusual activity
4. **Updates:** Keep dependencies updated
5. **Testing:** Test changes in development before deploying

## Future Enhancements

Potential features to add:
- Image upload to Firebase Storage
- Rich text editor for posts (e.g., Quill, TinyMCE)
- User management (multiple admin levels)
- Email notifications for new feedback
- Export functionality (CSV, PDF)
- Bulk operations for posts
- SEO metadata management
- Comment moderation
- Media library
- Backup/Restore functionality

## Support

For issues or questions:
1. Check the Firebase Console for errors
2. Review browser console logs
3. Verify all dependencies are installed
4. Check Firestore security rules

## License
MIT License - Feel free to use and modify for your projects.
