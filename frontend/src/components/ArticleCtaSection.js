import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function ArticleCtaSection({ data }) {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: '60% 40%',
      minHeight: 600,
      marginTop: 60,
      overflow: 'hidden'
    }}>
      {/* Left side - Blue background with content */}
      <div style={{
        background: data.backgroundColor || '#1890ff',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Title */}
        {data.title && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ 
              color: '#fff', 
              fontSize: 28, 
              fontWeight: 600,
              marginBottom: 12
            }}>
              {data.title}
            </h2>
            {data.subtitle && (
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        {/* CTA Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* CTA 1 */}
          {data.cta1Title && (
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start'
            }}>
              {data.cta1Image && (
                <img 
                  src={data.cta1Image} 
                  alt={data.cta1Title}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 8,
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 600,
                  marginBottom: 8,
                  color: '#262626'
                }}>
                  {data.cta1Title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 16
                }}>
                  {data.cta1Description}
                </p>
                {data.cta1ButtonText && (
                  <Button 
                    type="primary"
                    onClick={() => navigate(data.cta1ButtonUrl || '/appointment')}
                    style={{
                      background: data.backgroundColor || '#1890ff',
                      borderColor: data.backgroundColor || '#1890ff',
                      borderRadius: 6,
                      fontWeight: 600
                    }}
                  >
                    {data.cta1ButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CTA 2 */}
          {data.cta2Title && (
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              gap: 20,
              alignItems: 'flex-start'
            }}>
              {data.cta2Image && (
                <img 
                  src={data.cta2Image} 
                  alt={data.cta2Title}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 8,
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 600,
                  marginBottom: 8,
                  color: '#262626'
                }}>
                  {data.cta2Title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 16
                }}>
                  {data.cta2Description}
                </p>
                {data.cta2ButtonText && (
                  <Button 
                    type="primary"
                    onClick={() => navigate(data.cta2ButtonUrl || '/appointment')}
                    style={{
                      background: data.backgroundColor || '#1890ff',
                      borderColor: data.backgroundColor || '#1890ff',
                      borderRadius: 6,
                      fontWeight: 600
                    }}
                  >
                    {data.cta2ButtonText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Doctor image */}
      <div style={{
        background: '#f5f5f5',
        backgroundImage: data.doctorImage 
          ? `url(${data.doctorImage})` 
          : 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Optional overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(24,144,255,0.1), transparent)'
        }} />
      </div>
    </div>
  );
}

export default ArticleCtaSection;
