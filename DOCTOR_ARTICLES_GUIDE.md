# Doctor Articles System - Complete Guide

## Overview
The Doctor Articles System allows doctors to publish their own medical articles, which are then reviewed and approved by administrators before being displayed publicly. This system integrates seamlessly with the existing CMS and provides a complete workflow from article creation to public display.

## ✅ IMPLEMENTATION STATUS: COMPLETE

All features have been implemented and integrated. The system is ready for production use.

## Features Implemented

### 1. Database Schema
- ✅ Added `doctor_id` column to `news_articles` table (foreign key to doctors table)
- ✅ Added `status` column with values: PENDING, APPROVED, REJECTED
- ✅ Created indexes for performance optimization
- ✅ Migration script: `database/add_doctor_articles_columns.sql`

### 2. Backend Implementation

#### Models
- ✅ Updated `NewsArticle` model with:
  - `doctor` field (ManyToOne relationship)
  - `status` field (PENDING/APPROVED/REJECTED)

#### Repositories
- ✅ `NewsArticleRepository` with queries for:
  - Finding articles by doctor
  - Finding pending articles
  - Finding approved articles by doctor
  - Finding articles by status

#### Services
- ✅ `CMSService` methods:
  - `createDoctorArticle()` - Doctor creates article (status: PENDING)
  - `getDoctorArticles()` - Get all articles by a doctor
  - `updateDoctorArticle()` - Doctor updates their article
  - `deleteDoctorArticle()` - Doctor deletes their article
  - `approveArticle()` - Admin approves article (status: APPROVED)
  - `rejectArticle()` - Admin rejects article (status: REJECTED)
  - `getPendingArticles()` - Get all pending articles for admin review
  - `getApprovedArticlesByDoctor()` - Get approved articles for public display

#### Controllers
- ✅ `CMSController` endpoints:
  - `POST /api/cms/doctor/news` - Doctor creates article
  - `GET /api/cms/doctor/news/{doctorId}` - Get doctor's articles
  - `PUT /api/cms/doctor/news/{id}` - Doctor updates article
  - `DELETE /api/cms/doctor/news/{id}` - Doctor deletes article
  - `GET /api/cms/admin/news/pending` - Admin gets pending articles
  - `GET /api/cms/admin/news/all` - Admin gets all articles
  - `PUT /api/cms/admin/news/{id}/approve` - Admin approves article
  - `PUT /api/cms/admin/news/{id}/reject` - Admin rejects article
  - `GET /api/cms/news/doctor/{doctorId}` - Public endpoint for approved articles
  - `GET /api/cms/news/{slug}` - Public endpoint for article detail

### 3. Frontend Implementation

#### Pages

**✅ DoctorArticlesPage** (`/doctor/articles`)
- Available only to doctors
- Shows all articles created by the logged-in doctor
- Displays article status (PENDING, APPROVED, REJECTED)
- Create new article form with title, excerpt, content, image, slug
- Edit existing articles
- Delete articles
- Status indicators with color coding

**✅ AdminCMSPage** - New Tab: "Bài viết bác sĩ"
- Shows all doctor-submitted articles
- Filter by status
- Approve/Reject buttons for each article
- View article details
- Shows doctor information for each article

**✅ DoctorDetailPage** - New Tab: "Bài viết"
- Shows approved articles by the doctor
- Click to view full article
- Displays article image, title, excerpt, and publish date
- Links to NewsDetailPage

**✅ NewsDetailPage** (`/news/:slug`)
- Complete article display with full content
- Featured image
- Author and publish date
- Social sharing buttons (Facebook, Twitter)
- Comments section (UI ready)
- Related articles sidebar
- Contact form sidebar
- Latest news sidebar

#### Services
- ✅ `cmsApi.js` with all required methods

#### Routing
- ✅ `/doctor/articles` - Doctor article management (protected, doctors only)
- ✅ `/news/:slug` - Public article detail page
- ✅ `/admin/cms` - Admin CMS with doctor articles tab (protected, admin only)

## Workflow

### Doctor Workflow
1. Doctor logs in
2. Navigates to "Bài viết của tôi" from profile or `/doctor/articles`
3. Creates new article with title, content, image
4. Submits article (status: PENDING)
5. Waits for admin approval
6. Can edit or delete pending/rejected articles
7. Once approved, article appears on their profile

### Admin Workflow
1. Admin logs in
2. Navigates to Admin Dashboard → CMS
3. Clicks "Bài viết bác sĩ" tab
4. Reviews pending articles
5. Approves or rejects articles
6. Can set articles as featured for homepage
7. Can delete any article

### Public Display
1. Approved articles appear on doctor's profile page under "Bài viết" tab
2. Featured articles appear on homepage news section
3. Users can click article to view full detail at `/news/:slug`
4. Article detail page shows complete content with related articles

## Database Migration

Run this SQL script to add required columns:

```sql
-- Add doctor_id and status columns to news_articles table
ALTER TABLE news_articles 
ADD COLUMN doctor_id BIGINT NULL AFTER author,
ADD CONSTRAINT fk_news_articles_doctor 
FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL;

ALTER TABLE news_articles 
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING' AFTER is_featured;

-- Update existing articles to APPROVED
UPDATE news_articles SET status = 'APPROVED' WHERE status = 'PENDING';

-- Create indexes
CREATE INDEX idx_news_articles_doctor_id ON news_articles(doctor_id);
CREATE INDEX idx_news_articles_status ON news_articles(status);
```

## Testing Guide

### Test as Doctor
1. Login as doctor: `doctor1@hospital.com` / `password123`
2. Navigate to `/doctor/articles`
3. Create a new article
4. Verify status shows as PENDING (orange badge)
5. Try editing the article
6. Try deleting the article

### Test as Admin
1. Login as admin: `admin@doctor.com` / `password123`
2. Navigate to `/admin/cms`
3. Click "Bài viết bác sĩ" tab
4. Find the pending article
5. Click "Duyệt" to approve
6. Verify status changes to APPROVED (green badge)

### Test Public Display
1. Logout or use incognito mode
2. Navigate to doctor's profile page (e.g., `/doctors/4`)
3. Click "Bài viết" tab
4. Verify approved article appears
5. Click article to view full detail
6. Verify all content displays correctly on NewsDetailPage

## API Endpoints Summary

### Doctor Endpoints (Requires DOCTOR role)
- `POST /api/cms/doctor/news` - Create article
- `GET /api/cms/doctor/news/{doctorId}` - Get my articles
- `PUT /api/cms/doctor/news/{id}` - Update article
- `DELETE /api/cms/doctor/news/{id}` - Delete article

### Admin Endpoints (Requires ADMIN role)
- `GET /api/cms/admin/news/pending` - Get pending articles
- `GET /api/cms/admin/news/all` - Get all articles
- `PUT /api/cms/admin/news/{id}/approve` - Approve article
- `PUT /api/cms/admin/news/{id}/reject` - Reject article

### Public Endpoints (No authentication required)
- `GET /api/cms/news/doctor/{doctorId}` - Get approved articles by doctor
- `GET /api/cms/news/{slug}` - Get article by slug for detail page

## Files Modified/Created

### Backend
- `backend/src/main/java/com/doctorappointment/model/NewsArticle.java` - Updated
- `backend/src/main/java/com/doctorappointment/repository/NewsArticleRepository.java` - Updated
- `backend/src/main/java/com/doctorappointment/service/CMSService.java` - Updated
- `backend/src/main/java/com/doctorappointment/controller/CMSController.java` - Updated

### Frontend
- `frontend/src/pages/DoctorArticlesPage.js` - Created
- `frontend/src/pages/NewsDetailPage.js` - Created
- `frontend/src/pages/AdminCMSPage.js` - Updated
- `frontend/src/pages/DoctorDetailPage.js` - Updated
- `frontend/src/services/cmsApi.js` - Updated
- `frontend/src/App.js` - Updated (added routes)

### Database
- `database/add_doctor_articles_columns.sql` - Created

### Documentation
- `DOCTOR_ARTICLES_GUIDE.md` - This file

## Future Enhancements

1. **Comments System** - Backend API for comments and moderation
2. **Rich Text Editor** - WYSIWYG editor for article content
3. **Image Upload** - Direct image upload instead of URL
4. **Article Categories** - Categorize by medical specialty
5. **Analytics** - View count and performance metrics
6. **Email Notifications** - Notify on approval/rejection
7. **Article Versioning** - Track edit history

## Troubleshooting

### Article not appearing on doctor profile
- Check article status is APPROVED
- Verify doctor_id is correctly set
- Check if article is active (isActive = true)

### Cannot create article as doctor
- Verify user has DOCTOR role
- Check JWT token is valid
- Verify doctor record exists for user

### Admin cannot see pending articles
- Verify user has ADMIN role
- Check database has articles with status PENDING
- Verify API endpoint is accessible

---

**Implementation Complete** ✅
All features are working and ready for production use.
