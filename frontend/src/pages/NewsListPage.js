import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Spin, Button, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
          {/* Section Detail View - Vertical List */}
          {isSectionDetailView ? (
            <div>
              {/* Section Header - Medical Style */}
              <div style={{ 
                background: '#fff',
                borderRadius: 12,
                padding: '32px',
                marginBottom: 24,
                borderLeft: '6px solid #0ea5e9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <h1 style={{ 
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  {sectionsToDisplay[0].title}
                </h1>
                <p style={{ 
                  fontSize: 15,
                  color: '#64748b',
                  margin: 0
                }}>
                  {sectionArticles.length} bài viết
                </p>
              </div>

              {/* Vertical Article List - Clean Medical Design */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sectionArticles.slice(0, visibleCount).map((article, index) => (
                  <div 
                    key={article.id}
                    onClick={() => handleArticleClick(article.slug)}
                    style={{ 
                      display: 'flex',
                      gap: 20,
                      padding: 20,
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: '#fff'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.15)';
                      e.currentTarget.style.borderColor = '#0ea5e9';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {/* Article Image */}
                    {article.imageUrl && (
                      <div style={{ 
                        width: 240,
                        height: 160,
                        flexShrink: 0,
                        borderRadius: 6,
                        overflow: 'hidden',
                        background: '#f1f5f9'
                      }}>
                        <img
                          alt={article.title}
                          src={article.imageUrl}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}

                    {/* Article Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {/* Category Tag */}
                      {article.category && (
                        <div style={{
                          display: 'inline-block',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '4px 10px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          marginBottom: 10,
                          width: 'fit-content'
                        }}>
                          {article.category}
                        </div>
                      )}
                      
                      <h3 style={{ 
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#0f172a',
                        margin: '0 0 10px 0',
                        lineHeight: 1.5
                      }}>
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p style={{ 
                          fontSize: 14,
                          color: '#64748b',
                          margin: '0 0 12px 0',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.excerpt}
                        </p>
                      )}

                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontSize: 13,
                        color: '#94a3b8'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <Button 
                    onClick={handleLoadMore}
                    loading={loadingMore}
                    style={{ 
                      fontSize: 16,
                      fontWeight: 500,
                      height: 44,
                      padding: '0 40px',
                      borderRadius: 8
                    }}
                    type="primary"
                  >
                    Xem thêm ({sectionArticles.length - visibleCount} bài viết)
                  </Button>
                </div>
              )}

              {/* No more articles message */}
              {sectionArticles.length > 0 && sectionArticles.length <= visibleCount && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: 32,
                  padding: 20,
                  background: '#f8fafc',
                  borderRadius: 8
                }}>
                  <Text type="secondary">
                    Đã hiển thị tất cả {sectionArticles.length} bài viết
                  </Text>
                </div>
              )}

              {/* Empty state */}
              {sectionArticles.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 24px',
                  background: '#f8fafc',
                  borderRadius: 8
                }}>
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
        <div>
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
}

export default NewsListPage;
