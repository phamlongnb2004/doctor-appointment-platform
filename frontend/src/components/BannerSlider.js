import React from 'react';
import { Carousel } from 'antd';

function BannerSlider({ banners }) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      width: '100%',
      overflow: 'hidden'
    }}>
      <Carousel 
        autoplay 
        autoplaySpeed={6000}
        speed={1000}
        dots={true}
        infinite={true}
        pauseOnHover={false}
      >
        {banners.map((banner) => (
          <div key={banner.id}>
            <div style={{ 
              width: '100%',
              height: '550px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={banner.imageUrl} 
                alt={banner.title || 'Banner'}
                style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default BannerSlider;
