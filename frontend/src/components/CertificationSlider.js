import React, { useState } from 'react';
import { Carousel, Row, Col } from 'antd';
import '../styles/certification-slider.css';

function CertificationSlider({ certifications }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Filter certifications that have images
  const certsWithImages = certifications.filter(cert => cert.imageUrl);

  if (certsWithImages.length === 0) {
    return null;
  }

  return (
    <div className="certification-slider-wrapper">
      <Carousel
        autoplay
        autoplaySpeed={5000}
        dots={true}
        dotPosition="bottom"
        afterChange={setCurrentSlide}
      >
        {certsWithImages.map((cert) => (
          <div key={cert.id}>
            <div className="cert-slide">
              <Row gutter={[48, 48]} align="middle">
                {/* Image on left */}
                <Col xs={24} md={12}>
                  <div className="cert-image-container">
                    <img 
                      src={cert.imageUrl} 
                      alt={cert.name}
                      className="cert-image"
                    />
                  </div>
                </Col>
                
                {/* Content on right */}
                <Col xs={24} md={12}>
                  <div className="cert-content">
                    <h3 className="cert-title">{cert.name}</h3>
                    <p className="cert-description">
                      {cert.description || 'Chứng nhận uy tín từ các tổ chức quốc tế'}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CertificationSlider;
