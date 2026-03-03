import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import cmsAPI from '../services/cmsApi';
import '../styles/news-sidebar.css';

const NewsSidebar = ({ onlyHotline = false }) => {
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
        cmsAPI.getActiveNewsSidebarWidgets(),
        onlyHotline ? Promise.resolve({ data: [] }) : cmsAPI.getLatestNews(10)
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
    <div key={widget.id} className="widget widget--hotline">
      {/* Background Image with Overlay */}
      <div 
        className={`widget__background ${!widget.imageUrl ? 'widget__background--default' : ''}`}
        style={widget.imageUrl ? { backgroundImage: `url(${widget.imageUrl})` } : {}}
      />
      <div className="widget__overlay" />

      {/* Content */}
      <div className="widget__content">
        {/* Phone Icon */}
        <div className="widget__icon">
          <PhoneOutlined />
        </div>

        {/* Title */}
        <h3 className="widget__title">
          {widget.title || 'Hotline'}
        </h3>

        {/* Hotline Number */}
        <div className="widget__number">
          {widget.hotline || widget.subtitle}
        </div>

        {/* Description */}
        {widget.description && (
          <p className="widget__description">
            {widget.description}
          </p>
        )}

        {/* CTA Button */}
        {widget.buttonText && (
          <Button
            size="large"
            onClick={() => widget.buttonUrl && navigate(widget.buttonUrl)}
            className="widget__button"
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
      className={`widget widget--banner ${widget.buttonUrl ? 'widget--clickable' : ''}`}
      onClick={() => widget.buttonUrl && navigate(widget.buttonUrl)}
    >
      {/* Banner Image */}
      {widget.imageUrl && (
        <img
          src={widget.imageUrl}
          alt={widget.title}
          className="widget__image"
        />
      )}

      {/* Text Overlay (if has title or subtitle) */}
      {(widget.title || widget.subtitle) && (
        <div className="widget__overlay">
          {widget.title && (
            <h4 className="widget__title">
              {widget.title}
            </h4>
          )}
          {widget.subtitle && (
            <p className="widget__subtitle">
              {widget.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="sidebar__loading">Đang tải...</div>;
  }

  return (
    <div className="sidebar">
      {/* Render Widgets */}
      {widgets
        .filter(widget => !onlyHotline || widget.widgetType === 'hotline')
        .map(widget => {
          if (widget.widgetType === 'hotline') {
            return renderHotlineWidget(widget);
          } else if (widget.widgetType === 'banner') {
            return renderBannerWidget(widget);
          }
          return null;
        })}

      {/* Latest News Section - Only show if not onlyHotline */}
      {!onlyHotline && latestNews.length > 0 && (
        <div className="latest-news">
          <div className="latest-news__header">
            <h3 className="latest-news__title">
              Tin tức mới nhất
            </h3>
            <Button
              type="link"
              onClick={() => navigate('/news')}
              className="latest-news__link"
            >
              Xem thêm
            </Button>
          </div>

          {/* Latest News List */}
          <div className="latest-news__list">
            {latestNews.map((article, index) => (
              <div
                key={article.id || index}
                onClick={() => navigate(`/news/${article.slug}`)}
                className="article-item"
              >
                {/* Thumbnail */}
                <div className="article-item__thumbnail">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                    />
                  ) : (
                    <div className="article-item__thumbnail--empty">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="article-item__content">
                  <h4 className="article-item__title">
                    {article.title}
                  </h4>

                  <div className="article-item__meta">
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
      )}
    </div>
  );
};

export default NewsSidebar;
