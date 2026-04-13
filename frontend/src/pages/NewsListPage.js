import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Spin, Button, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';
import BannerSlider from '../components/BannerSlider';
import NewsSection from '../components/NewsSection';
import NewsSidebar from '../components/NewsSidebar';
import '../styles/news-list.css';

const { Text } = Typography;

function NewsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [newsSections, setNewsSections] = useState([]);
  const [newsSectionsData, setNewsSectionsData] = useState({});
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 articles initially
  
  const selectedSection = searchParams.get('section');
  const selectedCategory = searchParams.get('category');

  const fetchAllData = useCallback(async () => {
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

      // Fetch articles for each section (fetch more for section detail view)
      if (sections.length > 0) {
        const sectionsDataPromises = sections.map(async (section) => {
          try {
            // If viewing specific section, fetch more articles (50)
            const limit = selectedSection ? 50 : 5;
            const articlesResponse = await cmsAPI.getNewsBySectionName(
              section.name, 
              limit
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
  }, [selectedSection]);

  useEffect(() => {
    fetchAllData();
    setVisibleCount(10); // Reset visible count when section changes
  }, [selectedSection, selectedCategory, fetchAllData]);

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

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 5);
      setLoadingMore(false);
    }, 300);
  };

  const handleArticleClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  // Check if we're viewing a specific section
  const isSectionDetailView = selectedSection && sectionsToDisplay.length === 1;
  const sectionArticles = isSectionDetailView ? newsSectionsData[selectedSection] || [] : [];

  return (
    <div className="news-list-page">
      {/* Banner Slider */}
      {banners.length > 0 && <BannerSlider banners={banners} />}
      
      {/* Main Content: 2 Column Layout */}
      <div className="news-list-container">
        {/* Left Column: News Sections */}
        <div className="news-list-main">
          {/* Section Detail View - Vertical List */}
          {isSectionDetailView ? (
            <div>
              {/* Section Header - Medical Style */}
              <div className="section-header">
                <h1>{sectionsToDisplay[0].title}</h1>
                <p>{sectionArticles.length} bài viết</p>
              </div>

              {/* Vertical Article List - Clean Medical Design */}
              <div className="article-list">
                {sectionArticles.slice(0, visibleCount).map((article, index) => (
                  <div 
                    key={article.id}
                    onClick={() => handleArticleClick(article.slug)}
                    className="article-card"
                  >
                    {/* Article Image */}
                    {article.imageUrl && (
                      <div className="article-image">
                        <img
                          alt={article.title}
                          src={article.imageUrl}
                        />
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="article-content">
                      {/* Category Tag */}
                      {article.category && (
                        <div className="article-category">
                          {article.category}
                        </div>
                      )}
                      
                      <h3 className="article-title">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="article-excerpt">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="article-meta">
                        <span className="article-meta-item">
                          <CalendarOutlined />
                          {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        {article.author && (
                          <>
                            <span style={{ color: '#cbd5e1' }}>•</span>
                            <span className="article-meta-item">
                              <UserOutlined />
                              {article.author}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {sectionArticles.length > visibleCount && (
                <div className="load-more-section">
                  <Button 
                    onClick={handleLoadMore}
                    loading={loadingMore}
                    className="load-more-button"
                    type="primary"
                  >
                    Xem thêm ({sectionArticles.length - visibleCount} bài viết)
                  </Button>
                </div>
              )}

              {/* No more articles message */}
              {sectionArticles.length > 0 && sectionArticles.length <= visibleCount && (
                <div className="empty-state">
                  <Text type="secondary">
                    Đã hiển thị tất cả {sectionArticles.length} bài viết
                  </Text>
                </div>
              )}

              {/* Empty state */}
              {sectionArticles.length === 0 && (
                <div className="empty-state">
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Chưa có bài viết nào trong mục này
                  </Text>
                </div>
              )}
            </div>
          ) : (
            /* Normal Section View - Grid Layout */
            <>
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
            </>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="news-list-sidebar">
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
}

export default NewsListPage;
