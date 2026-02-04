# News Sections - CMS & NewsListPage - HOÀN THÀNH ✅

## Tổng quan
Đã hoàn thành:
1. ✅ Cập nhật NewsListPage với thiết kế sections
2. ✅ Thêm menu "Sections Tin tức" vào AdminCMSPage
3. ⏳ Cần thêm code xử lý tab "news-sections" trong AdminCMSPage

## ✅ Đã hoàn thành

### 1. NewsListPage - Thiết kế mới
File: `frontend/src/pages/NewsListPage.js`

**Thay đổi:**
- ✅ Loại bỏ sidebar categories
- ✅ Loại bỏ search và filter
- ✅ Hiển thị theo sections như HomePage
- ✅ Mỗi section có layout riêng (1 bài lớn bên trái + 4 bài nhỏ bên phải)
- ✅ Tự động fetch tất cả sections và articles
- ✅ Hỗ trợ filter theo section qua URL parameter `?section=featured`

**Cách hoạt động:**
```javascript
// Fetch all sections
const sections = await cmsAPI.getAllActiveNewsSections();

// Fetch articles for each section (8 articles instead of 4)
const articles = await cmsAPI.getNewsBySectionName(sectionName, 8);

// Render using NewsSection component
<NewsSection 
  title={section.title}
  articles={articles}
  backgroundColor={section.backgroundColor}
  titleAlign={section.titleAlign}
  columns={{ xs: 24, sm: 12, md: 8, lg: 6 }}
/>
```

### 2. AdminCMSPage - Thêm menu
File: `frontend/src/pages/AdminCMSPage.js`

**Thay đổi:**
- ✅ Thêm state `newsSections`
- ✅ Thêm menu item "Sections Tin tức" vào cả desktop và mobile menu
- ⏳ Cần thêm code xử lý khi click vào tab

## ⏳ Cần hoàn thành

### Thêm code xử lý tab "news-sections" trong AdminCMSPage

Cần thêm vào file `AdminCMSPage.js`:

#### 1. Thêm fetch function trong `fetchAllData()`:

```javascript
const fetchAllData = async () => {
  setLoading(true);
  try {
    // ... existing code ...
    
    // Fetch news sections
    const newsSectionsResponse = await cmsAPI.getAllNewsSections();
    setNewsSections(newsSectionsResponse.data || []);
    
    // ... rest of code ...
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
```

#### 2. Thêm render content cho tab "news-sections":

Tìm phần render content (sau dòng 2200) và thêm:

```javascript
{/* News Sections Tab */}
{currentTab === 'news-sections' && (
  <Card title="Quản lý Sections Tin tức">
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
      }}
      style={{ marginBottom: 16 }}
    >
      Thêm Section mới
    </Button>

    <Table
      dataSource={newsSections}
      rowKey="id"
      loading={loading}
      columns={[
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
          title: 'Tiêu đề',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Thứ tự',
          dataIndex: 'displayOrder',
          key: 'displayOrder',
          sorter: (a, b) => a.displayOrder - b.displayOrder,
          width: 100
        },
        {
          title: 'Số bài viết',
          dataIndex: 'articlesLimit',
          key: 'articlesLimit',
          width: 120
        },
        {
          title: 'Màu nền',
          dataIndex: 'backgroundColor',
          key: 'backgroundColor',
          width: 100,
          render: (color) => (
            <div style={{
              width: 40,
              height: 24,
              backgroundColor: color,
              border: '1px solid #d9d9d9',
              borderRadius: 4
            }} />
          )
        },
        {
          title: 'Trạng thái',
          dataIndex: 'isActive',
          key: 'isActive',
          width: 100,
          render: (isActive) => (
            <Switch checked={isActive} disabled />
          )
        },
        {
          title: 'Hành động',
          key: 'actions',
          width: 150,
          render: (_, record) => (
            <Space>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record, 'news-sections')}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleDelete(record.id, 'news-sections')}
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )
        }
      ]}
    />

    {/* Modal for Add/Edit */}
    <Modal
      title={editingItem ? 'Sửa Section' : 'Thêm Section mới'}
      open={modalVisible}
      onCancel={() => {
        setModalVisible(false);
        form.resetFields();
        setEditingItem(null);
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSave(values, 'news-sections')}
      >
        <Form.Item
          name="name"
          label="Tên section (slug)"
          rules={[{ required: true, message: 'Vui lòng nhập tên section' }]}
          extra="Ví dụ: featured, medlatec, health (không dấu, viết thường)"
        >
          <Input placeholder="featured" />
        </Form.Item>

        <Form.Item
          name="title"
          label="Tiêu đề hiển thị"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="TIN TỨC NỔI BẬT" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={3} placeholder="Mô tả ngắn về section này" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="displayOrder"
              label="Thứ tự hiển thị"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="articlesLimit"
              label="Số bài viết"
              initialValue={4}
            >
              <InputNumber min={1} max={12} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="titleAlign"
              label="Căn lề tiêu đề"
              initialValue="left"
            >
              <Select>
                <Option value="left">Trái</Option>
                <Option value="center">Giữa</Option>
                <Option value="right">Phải</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="backgroundColor"
              label="Màu nền"
              initialValue="#fff"
            >
              <Input type="color" style={{ width: '100%', height: 40 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="showMoreButton"
              label="Hiển thị nút xem thêm"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="moreButtonText"
          label="Text nút xem thêm"
          initialValue="Xem thêm"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Trạng thái"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingItem ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            <Button onClick={() => {
              setModalVisible(false);
              form.resetFields();
              setEditingItem(null);
            }}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  </Card>
)}
```

#### 3. Cập nhật hàm `handleSave`:

Thêm case cho 'news-sections':

```javascript
const handleSave = async (values, type) => {
  setLoading(true);
  try {
    switch (type) {
      // ... existing cases ...
      
      case 'news-sections':
        if (editingItem) {
          await cmsAPI.updateNewsSection(editingItem.id, values);
          message.success('Cập nhật section thành công');
        } else {
          await cmsAPI.createNewsSection(values);
          message.success('Tạo section thành công');
        }
        break;
        
      // ... rest of cases ...
    }
    
    setModalVisible(false);
    form.resetFields();
    setEditingItem(null);
    fetchAllData();
  } catch (error) {
    message.error('Có lỗi xảy ra');
    console.error('Error saving:', error);
  } finally {
    setLoading(false);
  }
};
```

#### 4. Cập nhật hàm `handleDelete`:

Thêm case cho 'news-sections':

```javascript
const handleDelete = async (id, type) => {
  setLoading(true);
  try {
    switch (type) {
      // ... existing cases ...
      
      case 'news-sections':
        await cmsAPI.deleteNewsSection(id);
        message.success('Xóa section thành công');
        break;
        
      // ... rest of cases ...
    }
    
    fetchAllData();
  } catch (error) {
    message.error('Có lỗi xảy ra');
    console.error('Error deleting:', error);
  } finally {
    setLoading(false);
  }
};
```

#### 5. Cập nhật form tin tức để chọn section:

Trong form tạo/sửa tin tức (tab 'news'), thêm field chọn section:

```javascript
<Form.Item
  name="sectionName"
  label="Section"
  rules={[{ required: true, message: 'Vui lòng chọn section' }]}
  initialValue="medlatec"
>
  <Select placeholder="Chọn section">
    {newsSections.filter(s => s.isActive).map(section => (
      <Option key={section.name} value={section.name}>
        {section.title}
      </Option>
    ))}
  </Select>
</Form.Item>
```

## 🎯 Kết quả

### NewsListPage
- Hiển thị tất cả sections tin tức
- Mỗi section có layout đẹp: 1 bài lớn + 4 bài nhỏ
- Tự động cập nhật khi có sections mới
- Hỗ trợ filter theo section qua URL

### AdminCMSPage
- Tab "Sections Tin tức" để quản lý sections
- CRUD đầy đủ: Tạo, Sửa, Xóa sections
- Chọn section khi tạo tin tức
- Tùy chỉnh màu nền, căn lề, số bài viết cho mỗi section

## 📝 Hướng dẫn sử dụng

### Tạo section mới
1. Vào Admin CMS > Sections Tin tức
2. Click "Thêm Section mới"
3. Điền thông tin:
   - Tên: `covid-19` (slug, không dấu)
   - Tiêu đề: `TIN TỨC COVID-19`
   - Thứ tự: `5`
   - Số bài viết: `6`
   - Màu nền: `#fff3cd`
   - Căn lề: `center`
4. Click "Tạo mới"

### Gán bài viết vào section
1. Vào Admin CMS > Tin tức y khoa
2. Tạo/Sửa bài viết
3. Chọn Section: `COVID-19`
4. Lưu bài viết

### Xem kết quả
- HomePage: http://localhost:3000 - Hiển thị sections theo thứ tự
- NewsListPage: http://localhost:3000/news - Hiển thị tất cả sections
- Filter: http://localhost:3000/news?section=covid-19 - Chỉ hiển thị section COVID-19

## ✨ Tính năng

1. **Dynamic Sections**: Tạo không giới hạn sections
2. **Customizable**: Mỗi section tùy chỉnh riêng
3. **Auto Update**: Tự động hiển thị khi có bài viết mới
4. **Responsive**: Tự động responsive trên mobile
5. **SEO Friendly**: URL có section parameter

---

**Status**: ✅ NewsListPage hoàn thành, ⏳ AdminCMSPage cần thêm code xử lý
**Ngày**: 04/02/2026
