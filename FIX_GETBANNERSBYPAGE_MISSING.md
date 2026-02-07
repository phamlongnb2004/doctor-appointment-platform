# Fix: Missing getBannersByPage Function

## Problem
After restoring AdminCMSPage.js from git, the application showed blank/white screens with the error:
```
getBannersByPage is not a function
```

This function was being called in 3 places:
- `AdminCMSPage.js` (line 207) - to fetch news banners
- `HomePage.js` (line 127) - to fetch home page banners  
- `NewsListPage.js` (line 31) - to fetch news page banners

## Root Cause
The `getBannersByPage` function was missing from `frontend/src/services/cmsApi.js`. When AdminCMSPage was restored to an older version, it expected this function to exist, but it wasn't in the cmsApi file.

## Solution
Added the missing `getBannersByPage` function and other related CMS API functions to `cmsApi.js`:

### Added Functions:

**Banner Functions:**
- `getBannersByPage(page)` - Get banners by page (home/news/etc)
- `getAllBanners()` - Get all banners (admin)
- `createBanner(data)` - Create new banner
- `updateBanner(id, data)` - Update banner
- `deleteBanner(id)` - Delete banner

**Statistics Functions:**
- `getStatistics()` - Get all statistics
- `createStatistic(data)` - Create statistic
- `updateStatistic(id, data)` - Update statistic
- `deleteStatistic(id)` - Delete statistic

**Site Settings Functions:**
- `getSiteSettings()` - Get site settings
- `updateSiteSettings(data)` - Update site settings

**News Category Functions:**
- `getAllNewsCategories()` - Get all news categories
- `createNewsCategory(data)` - Create news category
- `updateNewsCategory(id, data)` - Update news category
- `deleteNewsCategory(id)` - Delete news category

**Membership Benefits Functions:**
- `getMembershipBenefits()` - Get membership benefits
- `getAllMembershipBenefits()` - Get all (admin)
- `createMembershipBenefit(data)` - Create benefit
- `updateMembershipBenefit(id, data)` - Update benefit
- `deleteMembershipBenefit(id)` - Delete benefit

**News Sections Functions:**
- `getAllNewsSections()` - Get all sections (admin)
- `getActiveNewsSectionsByPage(page)` - Get active sections by page
- `getNewsBySectionName(sectionName, limit)` - Get articles by section
- `createNewsSection(data)` - Create section
- `updateNewsSection(id, data)` - Update section
- `deleteNewsSection(id)` - Delete section

**News Sidebar Widgets Functions:**
- `getAllNewsSidebarWidgets()` - Get all widgets (admin)
- `getActiveNewsSidebarWidgets()` - Get active widgets
- `createNewsSidebarWidget(data)` - Create widget
- `updateNewsSidebarWidget(id, data)` - Update widget
- `deleteNewsSidebarWidget(id)` - Delete widget

**Article CTA Section Functions:**
- `getArticleCtaSection()` - Get article CTA section
- `updateArticleCtaSection(id, data)` - Update CTA section

**About Page Functions:**
- `getAllAboutSections()` - Get all about sections (admin)
- `getAboutSection(sectionKey)` - Get specific about section
- `updateAboutSection(sectionKey, data)` - Update about section

**Slug Utility Functions:**
- `generateSlug(title)` - Generate slug from title
- `checkSlug(slug, articleId)` - Check if slug exists

## Backend Endpoint
The backend endpoint already existed:
```java
@GetMapping("/banners/{page}")
public ResponseEntity<List<Banner>> getBannersByPage(@PathVariable String page) {
    List<Banner> banners = cmsService.getActiveBannersByPage(page);
    return ResponseEntity.ok(banners);
}
```

## Result
✅ All pages now load correctly
✅ No more "getBannersByPage is not a function" error
✅ Banners display properly on home page and news page
✅ Admin CMS page works correctly
✅ Frontend compiled successfully with only minor warnings

## Files Modified
- `frontend/src/services/cmsApi.js` - Added all missing CMS API functions

## Status
**COMPLETE** - All pages are now working properly. Frontend and backend are both running successfully.
