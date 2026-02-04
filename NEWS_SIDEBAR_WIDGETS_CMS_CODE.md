# Code cần thêm vào AdminCMSPage.js

## 1. Thêm vào handleDelete (tìm case 'news-sections':)

```javascript
case 'news-sections':
  await cmsAPI.deleteNewsSection(id);
  break;
case 'news-sidebar-widgets':
  await cmsAPI.deleteNewsSidebarWidget(id);
  break;
```

## 2. Thêm vào handleToggleStatus (tìm case 'news-sections':)

```javascript
case 'news-sections':
  currentItem = newsSections.find(item => item.id === id);
  break;
case 'news-sidebar-widgets':
  currentItem = newsSidebarWidgets.find(item => item.id === id);
  break;
```

Và trong switch update:

```javascript
case 'news-sections':
  await cmsAPI.updateNewsSection(id, updateData);
  break;
case 'news-sidebar-widgets':
  await cmsAPI.updateNewsSidebarWidget(id, updateData);
  break;
```

## 3. Thêm vào handleSubmit - Update section

```javascript
case 'news-sections':
  await cmsAPI.updateNewsSection(editingItem.id, data);
  break;
case 'news-sidebar-widgets':
  await cmsAPI.updateNewsSidebarWidget(editingItem.id, data);
  break;
```

## 4. Thêm vào handleSubmit - Create section

```javascript
case 'news-sections':
  await cmsAPI.createNewsSection(data);
  break;
case 'news-sidebar-widgets':
  await cmsAPI.createNewsSidebarWidget(data);
  break;
```

## 5. Thêm form case trong renderForm()

Tìm `case 'news-sections':` và thêm sau đó:

```javascript
case 'news-sidebar-widgets':
  return (
    <>
      <Form.Item
        name="widgetType"
        label="Loại widget"
        rules={[{ required: true, message: 'Vui lòng chọn loại widget' }]}
        initialValue="hotline"
      >
        <Select>
          <Option value="hotline">Hotline</Option>
          <Option value="banner">Banner/Quảng cáo</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="title"
        label="Tiêu đề"
      >
        <Input placeholder="Hotline" />
      </Form.Item>

      <Form.Item
        name="subtitle"
        label="Phụ đề / Số hotline"
      >
        <Input placeholder="1900565656" />
      </Form.Item>

      <Form.Item
        name="hotline"
        label="Số hotline (cho widget hotline)"
      >
        <Input placeholder="1900565656" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
      >
        <TextArea rows={3} placeholder="Liên hệ ngay với số hotline..." />
      </Form.Item>

      <Form.Item name="imageUrl" label="Hình ảnh">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            beforeUpload={handleUploadIcon}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Hình ảnh
            </Button>
          </Upload>
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt="preview" 
              style={{ 
                width: '100%',
                maxWidth: 400,
                height: 200,
                objectFit: 'cover',
                borderRadius: 8
              }} 
            />
          )}
        </Space>
      </Form.Item>

      <Form.Item
        name="buttonText"
        label="Text nút"
      >
        <Input placeholder="Liên hệ với chúng tôi" />
      </Form.Item>

      <Form.Item
        name="buttonUrl"
        label="URL nút"
      >
        <Input placeholder="/contact" />
      </Form.Item>

      <Form.Item
        name="displayOrder"
        label="Thứ tự hiển thị"
        initialValue={0}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Trạng thái"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
      </Form.Item>
    </>
  );
```

## 6. Thêm tab content (tìm `{/* News Sections Tab */}` và thêm sau đó)

```javascript
{/* News Sidebar Widgets Tab */}
{currentTab === 'news-sidebar-widgets' && (
  <Card 
    className="admin-cms-card"
    title={
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Quản lý Sidebar Tin tức</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          <PictureOutlined /> Quản lý hotline, banner và widgets trên sidebar trang tin tức
        </div>
      </div>
    }
    extra={
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        Thêm Widget
      </Button>
    }
  >
    <Table
      className="admin-cms-table"
      dataSource={newsSidebarWidgets}
      rowKey="id"
      loading={loading}
      columns={[
        {
          title: 'Loại',
          dataIndex: 'widgetType',
          key: 'widgetType',
          width: 120,
          render: (type) => {
            const typeMap = {
              'hotline': { text: 'Hotline', color: 'blue' },
              'banner': { text: 'Banner', color: 'green' }
            };
            const t = typeMap[type] || { text: type, color: 'default' };
            return <Tag color={t.color}>{t.text}</Tag>;
          }
        },
        {
          title: 'Tiêu đề',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Hình ảnh',
          dataIndex: 'imageUrl',
          key: 'imageUrl',
          width: 150,
          render: (url) => url ? (
            <img 
              src={url} 
              alt="widget" 
              style={{ 
                width: 100,
                height: 60,
                objectFit: 'cover',
                borderRadius: 4
              }} 
            />
          ) : <Tag color="default">Không có</Tag>
        },
        {
          title: 'Thứ tự',
          dataIndex: 'displayOrder',
          key: 'displayOrder',
          sorter: (a, b) => a.displayOrder - b.displayOrder,
          width: 100
        },
        {
          title: 'Trạng thái',
          dataIndex: 'isActive',
          key: 'isActive',
          width: 100,
          render: (isActive, record) => (
            <Switch 
              checked={isActive} 
              onChange={() => handleToggleStatus(record.id, isActive, 'news-sidebar-widgets')}
            />
          )
        },
        {
          title: 'Hành động',
          key: 'actions',
          width: 150,
          render: (_, record) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleDelete(record.id, 'news-sidebar-widgets')}
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </Space>
          )
        }
      ]}
    />
  </Card>
)}
```
