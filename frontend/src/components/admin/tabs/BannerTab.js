import React from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  InputNumber,
  Space,
  Popconfirm,
  Upload,
  Select,
  Tag,
  Typography,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PictureOutlined,
  HomeOutlined
} from '@ant-design/icons';
import cmsAPI from '../../../services/cmsApi';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function BannerTab({
  banners = [],
  loading = false,
  modalVisible = false,
  editingItem = null,
  onOpenModal = () => {},
  onCloseModal = () => {},
  onSave = () => {},
  onDelete = () => {},
  onToggleStatus = () => {},
  currentColor = '#1890ff',
  setCurrentColor = () => {},
  iconUrl = '',
  setIconUrl = () => {},
  uploading = false,
  handleUploadIcon = () => {}
}) {
  // Banner table columns
  const bannersColumns = [
    { 
      title: 'Hình ảnh Banner', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      width: '50%',
      render: (url) => url ? (
        <img 
          src={url} 
          alt="banner" 
          style={{ 
            width: '100%',
            maxWidth: 400,
            height: 100, 
            objectFit: 'cover', 
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }} 
        />
      ) : 'Không có'
    },
    { 
      title: 'Trang', 
      dataIndex: 'page', 
      key: 'page',
      width: '12%',
      render: (page) => {
        const pageMap = {
          'home': { text: 'Trang chủ', color: 'blue' },
          'news': { text: 'Tin tức', color: 'green' },
          'doctors': { text: 'Bác sĩ', color: 'purple' }
        };
        const p = pageMap[page] || { text: page, color: 'default' };
        return <Tag color={p.color}>{p.text}</Tag>;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: '10%',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => onToggleStatus(record.id, isActive, 'banners')}
        />
      )
    },
    { 
      title: 'Thứ tự', 
      dataIndex: 'displayOrder', 
      key: 'displayOrder',
      width: '8%'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onOpenModal(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record.id, 'banners')}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      className="admin-cms-card"
      title={
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Banner Slider</div>
          <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
            <PictureOutlined /> Hiển thị ở: Trang chủ (Section 1)
          </div>
        </div>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onOpenModal(null)}>
          Thêm Banner
        </Button>
      }
    >
      <Table
        className="admin-cms-table"
        dataSource={banners}
        rowKey="id"
        loading={loading}
        columns={bannersColumns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
        open={modalVisible}
        onCancel={onCloseModal}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          initialValues={{
            page: 'home',
            isActive: true,
            displayOrder: banners.length + 1,
            ...editingItem
          }}
          onFinish={async (values) => {
            const dataToSave = {
              ...values,
              imageUrl: iconUrl || editingItem?.imageUrl
            };
            
            // Handle displayOrder - if not provided, use current max + 1
            if (dataToSave.displayOrder === undefined) {
              const maxOrder = banners.reduce((max, b) => Math.max(max, b.displayOrder || 0), 0);
              dataToSave.displayOrder = maxOrder + 1;
            }
            
            // Ensure page is set
            if (!dataToSave.page) {
              dataToSave.page = 'home';
            }
            
            await onSave(dataToSave);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="page" label="Trang hiển thị">
                <Select>
                  <Option value="home">Trang chủ</Option>
                  <Option value="news">Tin tức</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="displayOrder" label="Thứ tự">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="title" label="Tiêu đề">
            <Input placeholder="Nhập tiêu đề banner" />
          </Form.Item>
          
          <Form.Item name="subtitle" label="Mô tả ngắn">
            <TextArea rows={2} placeholder="Mô tả ngắn cho banner" />
          </Form.Item>
          
          <Form.Item 
            name="imageUrl" 
            label="Hình ảnh Banner"
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh banner' }]}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                beforeUpload={handleUploadIcon}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Tải lên hình ảnh
                </Button>
              </Upload>
              {iconUrl || editingItem?.imageUrl ? (
                <div>
                  <img 
                    src={iconUrl || editingItem?.imageUrl} 
                    alt="Banner preview" 
                    style={{ 
                      width: '100%',
                      maxWidth: 400,
                      height: 180,
                      objectFit: 'cover',
                      border: '1px solid #d9d9d9',
                      borderRadius: 4
                    }} 
                  />
                </div>
              ) : null}
            </Space>
          </Form.Item>
          <Form.Item name="buttonText" label="Text Button">
            <Input />
          </Form.Item>
          <Form.Item name="buttonUrl" label="URL Button">
            <Input />
          </Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự hiển thị">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default BannerTab;
