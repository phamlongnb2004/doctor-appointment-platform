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
  CustomerServiceOutlined
} from '@ant-design/icons';
import cmsAPI from '../../../services/cmsApi';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function ServicesTab({
  services = [],
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
  const [form] = Form.useForm();
  
  // Services table columns
  const servicesColumns = [
    {
      title: 'Icon',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url) => url ? (
        <img 
          src={url} 
          alt="icon" 
          style={{ 
            width: 40, 
            height: 40, 
            objectFit: 'contain',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            padding: 2
          }} 
        />
      ) : 'Không có'
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: '20%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true, width: '25%' },
    { 
      title: 'Màu sắc', 
      dataIndex: 'color', 
      key: 'color',
      width: '12%',
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4, border: '1px solid #d9d9d9' }} />
          <Text>{color}</Text>
        </div>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      width: '10%',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => onToggleStatus(record.id, isActive, 'services')}
        />
      )
    },
    { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder', width: '8%' },
    {
      title: 'Hành động',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onOpenModal(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record.id, 'services')}
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
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Dịch vụ</div>
          <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
            <CustomerServiceOutlined /> Quản lý dịch vụ - Hiển thị ở trang chủ (Section 2)
          </div>
        </div>
      }
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onOpenModal(null)}>
          Thêm dịch vụ
        </Button>
      }
    >
      <Table
        className="admin-cms-table"
        dataSource={services}
        rowKey="id"
        loading={loading}
        columns={servicesColumns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
        open={modalVisible}
        onCancel={onCloseModal}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          initialValues={{
            isActive: true,
            displayOrder: services.length + 1,
            ...editingItem
          }}
          onFinish={async (values) => {
            const dataToSave = {
              ...values,
              imageUrl: iconUrl || editingItem?.imageUrl
            };
            
            if (dataToSave.displayOrder === undefined) {
              const maxOrder = services.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
              dataToSave.displayOrder = maxOrder + 1;
            }
            
            await onSave(dataToSave);
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="title" label="Tiêu đề dịch vụ" rules={[{ required: true }]}>
                <Input placeholder="Nhập tiêu đề dịch vụ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="displayOrder" label="Thứ tự">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả dịch vụ" />
          </Form.Item>
          
          <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                type="color" 
                value={currentColor}
                style={{ width: 80, height: 40 }} 
                onChange={(e) => {
                  const newColor = e.target.value;
                  setCurrentColor(newColor);
                  form.setFieldsValue({ color: newColor });
                }}
              />
              <Input 
                placeholder="#10b981" 
                value={currentColor}
                style={{ flex: 1 }}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setCurrentColor(newColor);
                  form.setFieldsValue({ color: newColor });
                }}
              />
            </Space.Compact>
          </Form.Item>
          
          <Form.Item 
            name="imageUrl" 
            label="Icon Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng tải lên icon' }]}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                beforeUpload={handleUploadIcon}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Tải lên Icon
                </Button>
              </Upload>
              {iconUrl && (
                <div style={{ marginTop: 8 }}>
                  <img 
                    src={iconUrl} 
                    alt="Icon preview" 
                    style={{ 
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      padding: 4
                    }} 
                  />
                </div>
              )}
            </Space>
          </Form.Item>
          
          <Form.Item name="buttonText" label="Text Button">
            <Input placeholder="Xem thêm" />
          </Form.Item>
          <Form.Item name="buttonUrl" label="URL Button">
            <Input placeholder="/dich-vu" />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default ServicesTab;
