import React from 'react';
import { Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/news-list.css';

const NewsSection = ({ 
  title = 'TIN TỨC NỔI BẬT',
  articles = [],
  backgroundColor = '#fff',
  titleAlign = 'left',
  showMoreButton = true,
  moreButtonText = 'Xem thêm',
  moreButtonUrl = '/news',
  layoutType = 'default', // 'default' or 'grid'
  isHomePage = false // NEW: Force grid layout on homepage
}) => {
  const navigate = useNavigate();

  if (!articles || articles.length === 0) {
    return null;
  }

  const handleArticleClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  const handleMoreClick = () => {
    navigate(moreButtonUrl);
  };

  // Use grid layout if: explicitly set to 'grid' OR on homepage
  const useGridLayout = layoutType === 'grid' || isHomePage;

  // Grid Layout (Medical News Style or Homepage)
  if (useGridLayout) {
    return (
      <section style={{ 
        padding: '60px 0',
        background: backgroundColor
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Section Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 32
          }}>
            <h2 style={{ 
              fontSize: 28,
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              textAlign: titleAlign,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {title}
            </h2>
          </div>

          {/* Grid Layout: 4 Columns */}
          <div className="news-section-grid" style={{ marginBottom: showMoreButton ? 32 : 0 }}>
            {articles.slice(0, 4).map((article) => (
              <div 
                key={article.id}
                onClick={() => handleArticleClick(article.slug)}
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Image */}
                <div style={{ 
                  width: '100%',
                  height: 180,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#f0f0f0'
                }}>
                  {article.imageUrl ? (
                    <img
                      alt={article.title}
                      src={article.imageUrl}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3 style={{ 
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 44
                  }}>
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p style={{ 
                      fontSize: 13,
                      color: '#64748b',
                      margin: '0 0 8px 0',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {article.excerpt}
                    </p>
                  )}

                  {/* View Details Link */}
                  <a 
                    href={`/news/${article.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleArticleClick(article.slug);
                    }}
                    style={{ 
                      fontSize: 14,
                      color: '#0ea5e9',
                      textDecoration: 'none',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Xem chi tiết →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {showMoreButton && (
            <div style={{ textAlign: 'center' }}>
              <Button 
                onClick={handleMoreClick}
                style={{ 
                  fontSize: 16,
                  fontWeight: 500,
                  height: 44,
                  padding: '0 32px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  color: '#475569'
                }}
              >
                {moreButtonText}
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default Layout (1 Large + 4 Small)
  const featuredArticle = articles[0];
  const smallArticles = articles.slice(1, 5);

  return (
    <section style={{ 
      padding: '60px 0',
      background: backgroundColor
    }}>
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Section Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 32
        }}>
          <h2 style={{ 
            fontSize: 28,
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            textAlign: titleAlign,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </h2>
          {showMoreButton && (
            <Button 
              type="link" 
              onClick={handleMoreClick}
              style={{ 
                fontSize: 16,
                fontWeight: 500,
                color: '#0ea5e9',
                padding: 0
              }}
            >
              {moreButtonText}
            </Button>
          )}
        </div>

        {/* News Layout: 1 Large + 4 Small */}
        <div className="news-section-default">
          {/* Featured Article - Left Side */}
          <div 
            onClick={() => handleArticleClick(featuredArticle.slug)}
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Large Image */}
            <div style={{ 
              width: '100%',
              height: 350,
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f0f0f0'
            }}>
              {featuredArticle.imageUrl ? (
                <img
                  alt={featuredArticle.title}
                  src={featuredArticle.imageUrl}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#999'
                }}>
                  No Image
                </div>
              )}
            </div>

            {/* Featured Article Content */}
            <div>
              <h3 style={{ 
                fontSize: 20,
                fontWeight: 700,
                color: '#1e293b',
                margin: '0 0 12px 0',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {featuredArticle.title}
              </h3>
              
              {featuredArticle.excerpt && (
                <p style={{ 
                  fontSize: 14,
                  color: '#64748b',
                  margin: '0 0 12px 0',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {featuredArticle.excerpt}
                </p>
              )}

              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#94a3b8'
              }}>
                <ClockCircleOutlined />
                <span>
                  {new Date(featuredArticle.publishedAt).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Small Articles - Right Side */}
          <div className="news-section-small-articles">
            {smallArticles.map((article, index) => (
              <div 
                key={article.id || index}
                onClick={() => handleArticleClick(article.slug)}
                style={{ 
                  display: 'flex',
                  gap: 16,
                  cursor: 'pointer',
                  padding: 12,
                  borderRadius: 8,
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Small Image */}
                <div style={{ 
                  width: 120,
                  height: 90,
                  flexShrink: 0,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#f0f0f0'
                }}>
                  {article.imageUrl ? (
                    <img
                      alt={article.title}
                      src={article.imageUrl}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: 12
                    }}>
                      No Image
                    </div>
                  )}
                </div>

                {/* Small Article Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ 
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: '0 0 8px 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.title}
                  </h4>
                  
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#94a3b8'
                  }}>
                    <ClockCircleOutlined />
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
