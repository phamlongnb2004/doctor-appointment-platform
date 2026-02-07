import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message,
  Space,
  Popconfirm,
  Tag,
  Upload,
  Image,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons';
import cmsAPI from '../services/cmsApi';
import RichTextEditor from '../components/RichTextEditor';
import axios from 'axios';
import '../styles/admin-cms.css';

const { TextArea } = Input;
const { Option } = Select;

function DoctorArticlesPage({ user }) {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [doctorId, setDoctorId] = useState(null); // Local state for doctorId
  const [categories, setCategories] = useState([]);
  
  // Slug states
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [slugSuggestion, setSlugSuggestion] = useState('');

  useEffect(() => {
    console.log('User changed:', user);
    if (user && user.role === 'DOCTOR') {
      // Check if we have doctorId in user or localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.doctorId) {
        console.log('Using doctorId from user prop:', user.doctorId);
        setDoctorId(user.doctorId);
      } else if (storedUser.doctorId) {
        console.log('Using doctorId from localStorage:', storedUser.doctorId);
        setDoctorId(storedUser.doctorId);
      } else {
        console.log('Doctor ID not found, fetching from API...');
        fetchDoctorId();
      }
    } else {
      console.log('User or role not available:', { user, role: user?.role });
    }
  }, [user]);

  // Fetch articles when doctorId changes
  useEffect(() => {
    if (doctorId) {
      console.log('Fetching articles for doctor:', doctorId);
      fetchArticles();
    }
  }, [doctorId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await cmsAPI.getAllNewsCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDoctorId = async () => {
    try {
      // Fetch doctor info by userId
      const response = await axios.get(`http://localhost:8080/api/doctors/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.id) {
        console.log('Doctor ID fetched:', response.data.id);
        // Update user object in localStorage
        const updatedUser = { ...user, doctorId: response.data.id };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Update local state to trigger articles fetch
        setDoctorId(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching doctor ID:', error);
      message.error('Không thể tải thông tin bác sĩ');
    }
  };

  const fetchArticles = async () => {
    if (!doctorId) {
      console.log('No doctorId available yet. DoctorId:', doctorId);
      return;
    }
    setLoading(true);
    try {
      const response = await cmsAPI.getDoctorArticles(doctorId);
      setArticles(response.data || []);
    } catch (error) {
      message.error('Lỗi khi tải bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    setContent('');
    setImageUrl('');
    setFeaturedImage(null);
    setImagePreview('');
    setSlugExists(false); // Reset slug validation
    setSlugSuggestion(''); // Reset slug suggestion
    setModalVisible(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setSlugExists(false); // Reset slug validation
    setSlugSuggestion(''); // Reset slug suggestion
    form.setFieldsValue({
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      category: article.category
    });
    setContent(article.content || '');
    setImageUrl(article.imageUrl || '');
    setImagePreview(article.imageUrl || '');
    setFeaturedImage(null);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await cmsAPI.deleteDoctorArticle(id);
      message.success('Xóa bài viết thành công!');
      fetchArticles();
    } catch (error) {
      message.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response
      const imageUrl = info.file.response.imageUrl || info.file.response.url;
      setImageUrl(imageUrl);
      setImagePreview(imageUrl);
      message.success('Tải ảnh đại diện thành công!');
    } else if (info.file.status === 'error') {
      message.error('Lỗi khi tải ảnh lên!');
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ chấp nhận file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    setFeaturedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent auto upload
  };

  // ==================== SLUG HANDLERS ====================
  
  const handleTitleChange = async (e) => {
    const title = e.target.value;
    console.log('Title changed:', title); // Debug log
    
    // Only auto-generate slug when creating new article (not editing)
    if (editingArticle) {
      console.log('Editing article, skip auto-generate'); // Debug log
      return;
    }
    
    if (title && title.trim()) {
      try {
        console.log('Generating slug for:', title); // Debug log
        const response = await cmsAPI.generateSlug(title);
        const generatedSlug = response.data.slug;
        console.log('Generated slug:', generatedSlug); // Debug log
        form.setFieldsValue({ slug: generatedSlug });
        
        // Check if slug exists immediately after generating
        checkSlugExists(generatedSlug);
      } catch (error) {
        console.error('Error generating slug:', error);
      }
    }
  };
  
  const checkSlugExists = async (slug, articleId = null) => {
    if (!slug || !slug.trim()) {
      setSlugExists(false);
      setSlugSuggestion('');
      return;
    }
    
    setSlugChecking(true);
    try {
      const response = await cmsAPI.checkSlug(slug, articleId || editingArticle?.id);
      console.log('Slug check response:', response.data); // Debug log
      setSlugExists(response.data.exists);
      setSlugSuggestion(response.data.suggestion || '');
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setSlugChecking(false);
    }
  };
  
  // Use ref to store timeout ID for debouncing
  const slugCheckTimeoutRef = React.useRef(null);
  
  const handleSlugChange = (e) => {
    const slug = e.target.value;
    
    // Clear previous timeout
    if (slugCheckTimeoutRef.current) {
      clearTimeout(slugCheckTimeoutRef.current);
    }
    
    // Reset states immediately
    setSlugExists(false);
    setSlugSuggestion('');
    
    // Debounce check
    if (slug && slug.trim()) {
      slugCheckTimeoutRef.current = setTimeout(() => {
        checkSlugExists(slug);
      }, 500);
    }
  };
  
  const useSuggestedSlug = () => {
    if (slugSuggestion) {
      form.setFieldsValue({ slug: slugSuggestion });
      setSlugExists(false);
      setSlugSuggestion('');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Upload featured image if selected
      let finalImageUrl = imageUrl;
      if (featuredImage) {
        const formData = new FormData();
        formData.append('image', featuredImage);
        
        const token = localStorage.getItem('token');
        const uploadResponse = await axios.post('http://localhost:8080/api/images/articles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        
        finalImageUrl = uploadResponse.data.imageUrl || uploadResponse.data.url;
      }

      const data = {
        ...values,
        content: content,
        imageUrl: finalImageUrl,
        doctorId: doctorId,  // Dùng doctorId từ state
        author: `${user.firstName} ${user.lastName}`
      };
      
      if (editingArticle) {
        await cmsAPI.updateDoctorArticle(editingArticle.id, data);
        message.success('Cập nhật bài viết thành công! Đang chờ admin duyệt.');
      } else {
        await cmsAPI.createDoctorArticle(data);
        message.success('Tạo bài viết thành công! Đang chờ admin duyệt.');
      }
      
      setModalVisible(false);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      message.error('Lỗi khi lưu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      'PENDING': { color: 'orange', text: 'Chờ duyệt' },
      'APPROVED': { color: 'green', text: 'Đã duyệt' },
      'REJECTED': { color: 'red', text: 'Từ chối' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      width: '15%'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: '15%'
    },
    {
      title: 'Ngày xuất bản',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: '15%'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: '25%'
    }
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card 
        title="Quản lý bài viết của tôi"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Tạo bài viết mới
          </Button>
        }
      >
        <Table
          className="admin-cms-table"
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingArticle ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input 
              placeholder="Nhập tiêu đề bài viết" 
              size="large"
              onChange={handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL thân thiện)"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
            validateStatus={slugExists ? 'error' : slugChecking ? 'validating' : ''}
            help={
              slugExists ? (
                <span style={{ color: '#ff4d4f' }}>
                  ⚠️ Slug này đã tồn tại! 
                  {slugSuggestion && (
                    <span>
                      {' '}Đề xuất: <a onClick={useSuggestedSlug} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{slugSuggestion}</a>
                    </span>
                  )}
                </span>
              ) : slugChecking ? 'Đang kiểm tra...' : 'Slug sẽ tự động tạo từ tiêu đề. VD: bai-viet-ve-suc-khoe'
            }
          >
            <Input 
              placeholder="slug-tu-dong-tao-tu-tieu-de" 
              onChange={handleSlugChange}
              disabled={slugChecking}
            />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập tóm tắt ngắn gọn về bài viết"
            />
          </Form.Item>

          <Form.Item 
            name="category" 
            label="Danh mục" 
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.filter(cat => cat.isActive).map(category => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện"
            extra="Kích thước tối đa 5MB. Định dạng: JPG, PNG, GIF"
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/*"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Featured"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  preview={false}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Nội dung"
            required
            extra="Bạn có thể chèn ảnh vào nội dung bằng cách click vào icon ảnh trên thanh công cụ"
          >
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung bài viết. Bạn có thể định dạng văn bản và chèn ảnh..."
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                {editingArticle ? 'Cập nhật' : 'Tạo bài viết'}
              </Button>
              <Button onClick={() => setModalVisible(false)} size="large">
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DoctorArticlesPage;
