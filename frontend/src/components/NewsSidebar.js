import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import cmsAPI from '../services/cmsApi';

const NewsSidebar = () => {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [widgetsRes, newsRes] = await Promise.all([
        cmsAPI.getNewsSidebarWidgets(),
        cmsAPI.getLatestNews(10)
      ]);
      setWidgets(widgetsRes.data || []);
      setLatestNews(newsRes.data || []);
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHotlineWidget = (widget) => (
    <div
      key={widget.id}
      style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Image with Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: widget.imageUrl ? `url(${widget.imageUrl})` : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(30, 58, 138, 0.85)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        padding: 32,
        color: '#fff',
        textAlign: 'center'
      }}>
        {/* Phone Icon */}
        <div style={{
          width: 64,
          height: 64,
          margin: '0 auto 16px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PhoneOutlined style={{ fontSize: 32, color: '#fff' }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 18,
          fontWeight: 600,
          color: '#fff',
          margin: '0 0 8px 0'
        }}>
          {widget.title || 'Hotline'}
        </h3>

        {/* Hotline Number */}
        <div style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#60a5fa',
          margin: '0 0 16px 0',
          letterSpacing: '2px'
        }}>
          {widget.hotline || widget.subtitle}
        </div>

        {/* Description */}
        {widget.description && (
          <p style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 24px 0'
          }}>
            {widget.description}
          </p>
        )}

        {/* CTA Button */}
        {widget.buttonText && (
          <Button
            type="primary"
            size="large"
            onClick={() => widget.buttonUrl && navigate(widget.buttonUrl)}
            style={{
              width: '100%',
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              background: '#60a5fa',
              border: 'none',
              borderRadius: 8
            }}
          >
            {widget.buttonText}
          </Button>
        )}
      </div>
    </div>
  );

  const renderBannerWidget = (widget) => (
    <div
      key={widget.id}
      style={{
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        cursor: widget.buttonUrl ? 'pointer' : 'default',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      onClick={() => widget.buttonUrl && navigate(widget.buttonUrl)}
    >
      {/* Banner Image */}
      {widget.imageUrl && (
        <img
          src={widget.imageUrl}
          alt={widget.title}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      )}

      {/* Text Overlay (if has title or subtitle) */}
      {(widget.title || widget.subtitle) && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          color: '#fff'
        }}>
          {widget.title && (
            <h4 style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 4px 0'
            }}>
              {widget.title}
            </h4>
          )}
          {widget.subtitle && (
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.9)',
              margin: 0
            }}>
              {widget.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div style={{ padding: 20 }}>Đang tải...</div>;
  }

  return (
    <div style={{ position: 'sticky', top: 80 }}>
      {/* Render Widgets */}
      {widgets.map(widget => {
        if (widget.widgetType === 'hotline') {
          return renderHotlineWidget(widget);
        } else if (widget.widgetType === 'banner') {
          return renderBannerWidget(widget);
        }
        return null;
      })}

      {/* Latest News Section */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1e293b',
            margin: 0
          }}>
            Tin tức mới nhất
          </h3>
          <Button
            type="link"
            onClick={() => navigate('/news')}
            style={{
              padding: 0,
              fontSize: 14,
              color: '#0ea5e9'
            }}
          >
            Xem thêm
          </Button>
        </div>

        {/* Latest News List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {latestNews.map((article, index) => (
            <div
              key={article.id || index}
              onClick={() => navigate(`/news/${article.slug}`)}
              style={{
                display: 'flex',
                gap: 12,
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Thumbnail */}
              <div style={{
                width: 80,
                height: 60,
                flexShrink: 0,
                borderRadius: 6,
                overflow: 'hidden',
                background: '#f0f0f0'
              }}>
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
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
                    fontSize: 10,
                    color: '#999'
                  }}>
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 6px 0',
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
                  gap: 4,
                  fontSize: 11,
                  color: '#94a3b8'
                }}>
                  <ClockCircleOutlined />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSidebar;
