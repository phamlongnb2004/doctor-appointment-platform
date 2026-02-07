// ============================================
// PHẦN 1: COLUMNS DEFINITIONS
// Thêm sau các columns khác (dòng ~900)
// ============================================

const serviceCategoryColumns = [
  { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { 
    title: 'Icon', 
    dataIndex: 'icon', 
    key: 'icon', 
    render: (icon) => <span style={{ fontSize: 24 }}>{icon}</span> 
  },
  { title: 'Thứ tự', dataIndex: 'displayOrder', key: 'displayOrder' },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive, record) => (
      <Switch 
        checked={isActive} 
        onChange={() => handleToggleStatus(record.id, isActive, 'service-categories')}
      />
    )
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id, 'service-categories')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];

const medicalServiceColumns = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
  { 
    title: 'Danh mục', 
    dataIndex: 'categoryId', 
    key: 'categoryId',
    render: (categoryId) => {
      const category = serviceCategories.find(c => c.id === categoryId);
      return category ? category.name : '-';
    }
  },
  { 
    title: 'Giá gốc', 
    dataIndex: 'originalPrice', 
    key: 'originalPrice',
    render: (price) => price ? `${price.toLocaleString()}đ` : '-'
  },
  { 
    title: 'Giá KM', 
    dataIndex: 'discountedPrice', 
    key: 'discountedPrice',
    render: (price) => price ? `${price.toLocaleString()}đ` : '-'
  },
  { 
    title: 'Giảm giá', 
    dataIndex: 'discountPercentage', 
    key: 'discountPercentage',
    render: (percent) => percent ? `-${percent}%` : '-'
  },
  { 
    title: 'Nổi bật', 
    dataIndex: 'isFeatured', 
    key: 'isFeatured',
    render: (isFeatured) => isFeatured ? <Tag color="gold">Nổi bật</Tag> : null
  },
  { 
    title: 'Trạng thái', 
    dataIndex: 'isActive', 
    key: 'isActive',
    render: (isActive, record) => (
      <Switch 
        checked={isActive} 
        onChange={() => handleToggleStatus(record.id, isActive, 'medical-services')}
      />
    )
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id, 'medical-services')}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    ),
  },
];

// ============================================
// PHẦN 2: TAB CONTENT RENDERING
// Thêm trước </Layout> (dòng ~3600+)
// ============================================

{/* Service Categories Tab */}
{currentTab === 'service-categories' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Danh mục dịch vụ</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <TagOutlined /> Quản lý danh mục dịch vụ y tế
        </div>
      </div>
    }
    extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm danh mục
      </Button>
    }
  >
    <Table
      className="admin-cms-table"
      columns={serviceCategoryColumns}
      dataSource={serviceCategories}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  </Card>
)}

{/* Medical Services Tab */}
{currentTab === 'medical-services' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Dịch vụ y tế</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <MedicineBoxOutlined /> Quản lý dịch vụ y tế
        </div>
      </div>
    }
    extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm dịch vụ
      </Button>
    }
  >
    <Table
      className="admin-cms-table"
      columns={medicalServiceColumns}
      dataSource={medicalServices}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1200 }}
    />
  </Card>
)}

{/* Bank Account Tab */}
{currentTab === 'bank-account' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Thông tin ngân hàng</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <SettingOutlined /> Cấu hình thông tin ngân hàng cho thanh toán QR
        </div>
      </div>
    }
  >
    <Form
      layout="vertical"
      initialValues={siteSettings}
      onFinish={async (values) => {
        try {
          await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
          message.success('Cập nhật thành công!');
          fetchAllData();
        } catch (error) {
          message.error('Lỗi khi cập nhật: ' + error.message);
        }
      }}
    >
      <Form.Item label="Mã ngân hàng" name="bankId">
        <Input placeholder="VD: MB, VCB, TCB" />
      </Form.Item>
      <Form.Item label="Tên ngân hàng" name="bankName">
        <Input placeholder="VD: Ngân hàng Quân đội MB" />
      </Form.Item>
      <Form.Item label="Số tài khoản" name="bankAccountNo">
        <Input placeholder="Nhập số tài khoản" />
      </Form.Item>
      <Form.Item label="Tên chủ tài khoản" name="bankAccountName">
        <Input placeholder="Nhập tên chủ tài khoản" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thông tin
        </Button>
      </Form.Item>
    </Form>
  </Card>
)}

{/* Footer Settings Tab */}
{currentTab === 'footer-settings' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Cài đặt Footer</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <SettingOutlined /> Cấu hình nội dung footer
        </div>
      </div>
    }
  >
    <Form
      layout="vertical"
      initialValues={siteSettings}
      onFinish={async (values) => {
        try {
          await cmsAPI.updateSiteSettings({ ...siteSettings, ...values });
          message.success('Cập nhật thành công!');
          fetchAllData();
        } catch (error) {
          message.error('Lỗi khi cập nhật: ' + error.message);
        }
      }}
    >
      <Form.Item label="Giới thiệu Footer" name="footerAboutText">
        <TextArea rows={4} placeholder="Nhập nội dung giới thiệu" />
      </Form.Item>
      <Form.Item label="Giờ làm việc" name="footerWorkingHours">
        <TextArea rows={3} placeholder="VD: Thứ 2 - Thứ 7: 7:00 - 20:00" />
      </Form.Item>
      <Form.Item label="Facebook URL" name="footerFacebookUrl">
        <Input placeholder="https://facebook.com/..." />
      </Form.Item>
      <Form.Item label="YouTube URL" name="footerYoutubeUrl">
        <Input placeholder="https://youtube.com/..." />
      </Form.Item>
      <Form.Item label="Zalo URL" name="footerZaloUrl">
        <Input placeholder="https://zalo.me/..." />
      </Form.Item>
      <Form.Item label="Copyright Text" name="footerCopyrightText">
        <Input placeholder="© 2024 MEDLATEC. All rights reserved." />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu cài đặt
        </Button>
      </Form.Item>
    </Form>
  </Card>
)}
