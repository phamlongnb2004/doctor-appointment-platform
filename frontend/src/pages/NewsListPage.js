import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Spin } from 'antd';
import cmsAPI from '../services/cmsApi';
import BannerSlider from '../components/BannerSlider';
import NewsSection from '../components/NewsSection';
import NewsSidebar from '../components/NewsSidebar';

const { Text } = Typography;

function NewsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [newsSections, setNewsSections] = useState([]);
  const [newsSectionsData, setNewsSectionsData] = useState({});
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedSection = searchParams.get('section');
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch banners and sections in parallel
      const [bannersResponse, sectionsResponse] = await Promise.all([
        cmsAPI.getBannersByPage('news').catch(() => ({ data: [] })),
        cmsAPI.getActiveNewsSectionsByPage('news').catch(() => ({ data: [] }))
      ]);

      setBanners(bannersResponse.data || []);
      const sections = sectionsResponse.data || [];
      setNewsSections(sections);

      // Fetch articles for each section (5 articles for the new layout: 1 large + 4 small)
      if (sections.length > 0) {
        const sectionsDataPromises = sections.map(async (section) => {
          try {
            const articlesResponse = await cmsAPI.getNewsBySectionName(
              section.name, 
              5 // Get 5 articles for each section
            );
            return {
              sectionName: section.name,
              articles: articlesResponse.data || []
            };
          } catch (error) {
            console.error(`Error fetching articles for section ${section.name}:`, error);
            return {
              sectionName: section.name,
              articles: []
            };
          }
        });

        const sectionsDataArray = await Promise.all(sectionsDataPromises);
        const sectionsDataMap = {};
        sectionsDataArray.forEach(item => {
          sectionsDataMap[item.sectionName] = item.articles;
        });
        setNewsSectionsData(sectionsDataMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '60vh' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Đang tải tin tức...</Text>
        </div>
      </div>
    );
  }

  // Filter sections based on URL params
  let sectionsToDisplay = newsSections;
  
  if (selectedSection) {
    // Filter by specific section name
    sectionsToDisplay = newsSections.filter(s => s.name === selectedSection);
  } else if (selectedCategory) {
    // Filter by category
    sectionsToDisplay = newsSections.filter(section => {
      if (!section.categoryFilter) return false;
      
      try {
        // Parse JSON array if it's a string
        const categories = typeof section.categoryFilter === 'string' 
          ? JSON.parse(section.categoryFilter) 
          : section.categoryFilter;
        
        // Check if the selected category is in the section's category filter
        if (Array.isArray(categories)) {
          return categories.includes(selectedCategory);
        } else {
          return categories === selectedCategory;
        }
      } catch (e) {
        // If not JSON, treat as plain string
        return section.categoryFilter === selectedCategory;
      }
    });
  }
  
  console.log('Sections to display:', sectionsToDisplay.length, sectionsToDisplay.map(s => s.name));

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: '64px' }}>
      {/* Banner Slider */}
      {banners.length > 0 && <BannerSlider banners={banners} />}
      
      {/* Main Content: 2 Column Layout */}
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: 32
      }}>
        {/* Left Column: News Sections */}
        <div>
          {sectionsToDisplay.map((section) => {
            const articles = newsSectionsData[section.name] || [];
            if (articles.length === 0) return null;
            
            return (
              <NewsSection 
                key={section.id}
                title={section.title}
                articles={articles}
                showMoreButton={section.showMoreButton}
                moreButtonText={section.moreButtonText}
                moreButtonUrl={`/news?section=${section.name}`}
                backgroundColor={section.backgroundColor}
                titleAlign={section.titleAlign}
                layoutType={section.layoutType || 'default'}
              />
            );
          })}

          {/* Empty state */}
          {sectionsToDisplay.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '100px 24px',
              background: '#fff',
              borderRadius: 12
            }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Chưa có tin tức nào
              </Text>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div>
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
}

export default NewsListPage;
