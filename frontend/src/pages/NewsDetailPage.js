import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Form, 
  message, 
  Spin,
  Avatar,
  Divider,
  Space
} from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';
import ArticleCtaSection from '../components/ArticleCtaSection';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function NewsDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [ctaSection, setCtaSection] = useState(null);
  const [commentForm] = Form.useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
    fetchCtaSection();
    
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await cmsAPI.getNewsBySlug(slug);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
      message.error('Không tìm thấy bài viết!');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await cmsAPI.getLatestNews(4);
      setRelatedArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const fetchCtaSection = async () => {
    try {
      const response = await cmsAPI.getArticleCtaSection();
      setCtaSection(response.data);
    } catch (error) {
      console.error('Error fetching CTA section:', error);
    }
  };

  const handleComment = async (values) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để bình luận!');
      navigate('/login');
      return;
    }

    try {
      // TODO: Implement comment API
      message.success('Bình luận của bạn đã được gửi và đang chờ duyệt!');
      commentForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi gửi bình luận!');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Title level={3}>Không tìm thấy bài viết</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            type="link"
          >
            Trang chủ
          </Button>
          <Text type="secondary"> / Tin tức y khoa / {article.title}</Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 12 }}>
              {/* Article Header */}
              <Title level={2} style={{ marginBottom: 16 }}>
                {article.title}
              </Title>

              {/* Meta Info */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <Divider type="vertical" />
                  <UserOutlined />
                  <Text type="secondary">{article.author}</Text>
                </Space>

                <Space>
                  <Button 
                    icon={<FacebookOutlined />} 
                    onClick={() => handleShare('facebook')}
                    shape="circle"
                  />
                  <Button 
                    icon={<TwitterOutlined />} 
                    onClick={() => handleShare('twitter')}
                    shape="circle"
                  />
                  <Button 
                    icon={<ShareAltOutlined />} 
                    shape="circle"
                  />
                </Space>
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <div style={{ 
                  background: '#f0f7ff', 
                  padding: 16, 
                  borderRadius: 8,
                  marginBottom: 24,
                  borderLeft: '4px solid #1890ff'
                }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {article.excerpt}
                  </Text>
                </div>
              )}

              {/* Featured Image */}
              {article.imageUrl && (
                <div style={{ marginBottom: 24 }}>
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    style={{ 
                      width: '100%', 
                      borderRadius: 8,
                      maxHeight: 500,
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}

              {/* Article Content */}
              <div 
                className="news-article-content"
                style={{ 
                  fontSize: 16, 
                  lineHeight: 1.8,
                  marginBottom: 40,
                  overflow: 'hidden',
                  maxWidth: '100%'
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Comments Section */}
              <Divider />
              <Title level={4}>Bình luận ({comments.length})</Title>
              
              {user ? (
                <Form
                  form={commentForm}
                  onFinish={handleComment}
                  style={{ marginBottom: 24 }}
                >
                  <Form.Item
                    name="comment"
                    rules={[{ required: true, message: 'Vui lòng nhập bình luận!' }]}
                  >
                    <TextArea 
                      rows={4} 
                      placeholder="Bạn nghĩ gì về tin này?"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Gửi bình luận
                    </Button>
                    <Text type="secondary" style={{ marginLeft: 16 }}>
                      Ý kiến của bạn sẽ được xét duyệt trước khi đăng
                    </Text>
                  </Form.Item>
                </Form>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 0',
                  background: '#fafafa',
                  borderRadius: 8
                }}>
                  <Text type="secondary">
                    Vui lòng <Button type="link" onClick={() => navigate('/login')}>đăng nhập</Button> để bình luận
                  </Text>
                </div>
              )}

              {/* Comments List */}
              {comments.length > 0 && (
                <div>
                  {comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: 16 }}>
                      <Space align="start">
                        <Avatar icon={<UserOutlined />} />
                        <div>
                          <Text strong>{comment.userName}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                          </Text>
                          <Paragraph style={{ marginTop: 8 }}>
                            {comment.content}
                          </Paragraph>
                        </div>
                      </Space>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card 
                title="Tin cùng chuyên mục" 
                style={{ marginTop: 24, borderRadius: 12 }}
              >
                {relatedArticles.map((relatedArticle) => (
                  <div 
                    key={relatedArticle.id}
                    style={{ 
                      display: 'flex', 
                      marginBottom: 16,
                      paddingBottom: 16,
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/news/${relatedArticle.slug}`)}
                  >
                    {relatedArticle.imageUrl && (
                      <img 
                        src={relatedArticle.imageUrl} 
                        alt={relatedArticle.title}
                        style={{ 
                          width: 120, 
                          height: 80, 
                          objectFit: 'cover',
                          borderRadius: 8,
                          marginRight: 16
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined /> {new Date(relatedArticle.publishedAt).toLocaleDateString('vi-VN')}
                      </Text>
                      <Title level={5} style={{ margin: '8px 0' }}>
                        {relatedArticle.title}
                      </Title>
                      <Paragraph ellipsis={{ rows: 2 }} type="secondary">
                        {relatedArticle.excerpt}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Contact Card */}
            <Card 
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                marginBottom: 24
              }}
            >
              <Title level={4} style={{ color: 'white' }}>
                Hotline
              </Title>
              <Title level={2} style={{ color: 'white', margin: '16px 0' }}>
                1900 56 56 56
              </Title>
              <Paragraph style={{ color: 'white' }}>
                Liên hệ ngay với số hotline của MEDLATEC để được phục vụ và sử dụng các dịch vụ khám, chữa bệnh hiện đại & cao cấp nhất.
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                block
                style={{ 
                  background: 'white', 
                  color: '#667eea',
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                Liên hệ với chúng tôi
              </Button>
            </Card>

            {/* Registration Form */}
            <Card 
              title="Đăng ký khám và tư vấn" 
              style={{ borderRadius: 12, marginBottom: 24 }}
            >
              <Form layout="vertical">
                <Form.Item 
                  label="Họ và tên"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                
                <Form.Item 
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                
                <Form.Item 
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email!' }]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                
                <Form.Item 
                  label="Nhu cầu khám"
                  name="note"
                >
                  <TextArea rows={3} placeholder="Nhu cầu khám của bạn là gì?" />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" block size="large">
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Latest News */}
            <Card 
              title="Tin tức mới nhất" 
              style={{ borderRadius: 12 }}
            >
              {relatedArticles.slice(0, 5).map((news) => (
                <div 
                  key={news.id}
                  style={{ 
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/news/${news.slug}`)}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <CalendarOutlined /> {new Date(news.publishedAt).toLocaleDateString('vi-VN')}
                  </Text>
                  <Title level={5} style={{ margin: '8px 0' }}>
                    {news.title}
                  </Title>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* Article CTA Section */}
      <ArticleCtaSection data={ctaSection} />
    </div>
  );
}

export default NewsDetailPage;
