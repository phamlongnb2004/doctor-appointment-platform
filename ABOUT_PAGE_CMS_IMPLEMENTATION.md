# About Page CMS Implementation Guide

## ✅ Completed Steps

### 1. Database Tables Created
- `about_hero` - Hero section (title, subtitle, background)
- `about_mission` - Mission section with features
- `about_values` - Core values (4 cards)
- `about_achievements` - Statistics/achievements
- `about_timeline` - Company milestones
- `about_team` - Leadership team members

### 2. Default Data Inserted
All tables have sample data ready to use.

## 🔄 Next Steps (To be implemented)

### Backend Models (Java)
Create in `backend/src/main/java/com/doctorappointment/model/`:
- `AboutHero.java`
- `AboutMission.java`
- `AboutValue.java`
- `AboutAchievement.java`
- `AboutTimeline.java`
- `AboutTeam.java`

### Repositories
Create in `backend/src/main/java/com/doctorappointment/repository/`:
- `AboutHeroRepository.java`
- `AboutMissionRepository.java`
- `AboutValueRepository.java`
- `AboutAchievementRepository.java`
- `AboutTimelineRepository.java`
- `AboutTeamRepository.java`

### Service Layer
Add methods to `CMSService.java`:
```java
// About Hero
public AboutHero getAboutHero()
public AboutHero saveAboutHero(AboutHero hero)

// About Mission  
public AboutMission getAboutMission()
public AboutMission saveAboutMission(AboutMission mission)

// About Values
public List<AboutValue> getAboutValues()
public AboutValue saveAboutValue(AboutValue value)
public void deleteAboutValue(Long id)

// About Achievements
public List<AboutAchievement> getAboutAchievements()
public AboutAchievement saveAboutAchievement(AboutAchievement achievement)
public void deleteAboutAchievement(Long id)

// About Timeline
public List<AboutTimeline> getAboutTimeline()
public AboutTimeline saveAboutTimeline(AboutTimeline timeline)
public void deleteAboutTimeline(Long id)

// About Team
public List<AboutTeam> getAboutTeam()
public AboutTeam saveAboutTeam(AboutTeam team)
public void deleteAboutTeam(Long id)
```

### Controller Endpoints
Add to `CMSController.java`:
```java
@GetMapping("/about/hero")
@GetMapping("/about/mission")
@GetMapping("/about/values")
@GetMapping("/about/achievements")
@GetMapping("/about/timeline")
@GetMapping("/about/team")

@PostMapping("/about/hero")
@PostMapping("/about/mission")
@PostMapping("/about/values")
@PostMapping("/about/achievements")
@PostMapping("/about/timeline")
@PostMapping("/about/team")

@DeleteMapping("/about/values/{id}")
@DeleteMapping("/about/achievements/{id}")
@DeleteMapping("/about/timeline/{id}")
@DeleteMapping("/about/team/{id}")
```

### Frontend CMS API
Add to `frontend/src/services/cmsApi.js`:
```javascript
// About Page APIs
getAboutHero: () => api.get('/cms/about/hero'),
saveAboutHero: (data) => api.post('/cms/about/hero', data),

getAboutMission: () => api.get('/cms/about/mission'),
saveAboutMission: (data) => api.post('/cms/about/mission', data),

getAboutValues: () => api.get('/cms/about/values'),
saveAboutValue: (data) => api.post('/cms/about/values', data),
deleteAboutValue: (id) => api.delete(`/cms/about/values/${id}`),

// ... similar for achievements, timeline, team
```

### AdminCMSPage Integration
Add new tab "Trang giới thiệu" with sub-sections:
1. Hero Section
2. Mission & Vision
3. Core Values
4. Achievements
5. Timeline
6. Team Members

### AboutPage.js Update
Replace hardcoded data with API calls:
```javascript
useEffect(() => {
  fetchAboutPageData();
}, []);

const fetchAboutPageData = async () => {
  const [hero, mission, values, achievements, timeline, team] = await Promise.all([
    cmsAPI.getAboutHero(),
    cmsAPI.getAboutMission(),
    cmsAPI.getAboutValues(),
    cmsAPI.getAboutAchievements(),
    cmsAPI.getAboutTimeline(),
    cmsAPI.getAboutTeam()
  ]);
  
  setHeroData(hero.data);
  setMissionData(mission.data);
  // ... set other states
};
```

## 📋 Implementation Priority

1. ✅ Database & SQL (DONE)
2. ⏳ Backend Models & Repositories
3. ⏳ Service Layer
4. ⏳ Controller Endpoints
5. ⏳ Frontend API Integration
6. ⏳ CMS Interface
7. ⏳ AboutPage Dynamic Data

## 🎨 CMS Features

Each section will have:
- ✏️ Edit existing content
- ➕ Add new items (for lists)
- 🗑️ Delete items
- 🔄 Reorder items (display_order)
- 👁️ Toggle active/inactive
- 🖼️ Image upload support
- 🎨 Color picker (for values)
- 📝 Rich text editor (for descriptions)

## 🚀 Quick Start

Run the SQL file:
```bash
.\run_create_about_tables.bat
```

Then implement backend models, services, and frontend integration following the structure above.
