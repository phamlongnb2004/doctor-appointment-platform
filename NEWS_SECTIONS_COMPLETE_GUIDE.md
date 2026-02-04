# Hướng dẫn hoàn chỉnh: Hệ thống News Sections

## Tổng quan
Hệ thống News Sections cho phép bạn tạo và quản lý nhiều section tin tức khác nhau từ CMS. Mỗi section có thể có thiết kế và dữ liệu riêng.

## Các bước thực hiện

### Bước 1: Chạy SQL để tạo bảng

```bash
# Chạy file bat
run_create_news_sections.bat

# Hoặc chạy trực tiếp
mysql -u root doctor_appointment_db < database/create_news_sections_table.sql
```

SQL này sẽ:
- Tạo bảng `news_sections` để quản lý các section
- Thêm cột `section_name` vào bảng `news_articles`
- Insert 4 section mặc định: featured, medlatec, health, medical-topics

### Bước 2: Restart Backend

Backend cần restart để load các model và repository mới:

```bash
cd backend
mvn spring-boot:run
```

### Bước 3: Cập nhật HomePage.js

File `HomePage.js` đã được cập nhật để:
1. Fetch tất cả active news sections
2. Fetch articles cho từng section
3. Render NewsSection component cho mỗi section

Thêm code sau vào `fetchAllData()`:

```javascript
const fetchAllData = async () => {
  setLoading(true);
  try {
    // Fetch news sections
    const sectionsResponse = await cmsAPI.getAllActiveNewsSections();
    const sections = sectionsResponse.data || [];
    setNewsSections(sections);
    
    // Fetch articles for each section
    const sectionsDataPromises = sections.map(async (section) => {
      try {
        const articlesResponse = await cmsAPI.getNewsBySectionName(
          section.name, 
          section.articlesLimit || 4
        );
        return {
          sectionName: section.name,
          articles: articlesResponse.data || []
        };
      } catch (error) {
        console.error(`Error fetching articles for section ${section.name}:`, error);
        return {
          sectionName: section.name,
          articles: []
        };
      }
    });
    
    const sectionsDataArray = await Promise.all(sectionsDataPromises);
    const sectionsDataMap = {};
    sectionsDataArray.forEach(item => {
      sectionsDataMap[item.sectionName] = item.articles;
    });
    setNewsSectionsData(sectionsDataMap);
    
    // ... rest of your fetch code
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
```

Thêm render sections:

```jsx
{/* Dynamic News Sections */}
{newsSections.map((section) => {
  const articles = newsSectionsData[section.name] || [];
  if (articles.length === 0) return null;
  
  return (
    <NewsSection 
      key={section.id}
      title={section.title}
      articles={articles}
      showMoreButton={section.showMoreButton}
      moreButtonText={section.moreButtonText}
      moreButtonUrl={`/news?section=${section.name}`}
      backgroundColor={section.backgroundColor}
      titleAlign={section.titleAlign}
      columns={{ xs: 24, sm: 12, lg: 6 }}
    />
  );
})}
```

### Bước 4: Thêm quản lý News Sections vào AdminCMSPage

Thêm tab mới trong AdminCMSPage.js:

```jsx
const tabs = [
  // ... existing tabs
  {
    key: 'news-sections',
    label: 'Sections Tin tức',
    children: <NewsSectionsTab />
  }
];
```

Tạo component NewsSectionsTab:

```jsx
const NewsSectionsTab = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await cmsAPI.getAllNewsSections();
      setSections(response.data || []);
    } catch (error) {
      message.error('Lỗi khi tải sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingSection) {
        await cmsAPI.updateNewsSection(editingSection.id, values);
        message.success('Cập nhật section thành công');
      } else {
        await cmsAPI.createNewsSection(values);
        message.success('Tạo section thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingSection(null);
      fetchSections();
    } catch (error) {
      message.error('Lỗi khi lưu section');
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    form.setFieldsValue(section);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await cmsAPI.deleteNewsSection(id);
      message.success('Xóa section thành công');
      fetchSections();
    } catch (error) {
      message.error('Lỗi khi xóa section');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
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
    },
    {
      title: 'Số bài viết',
      dataIndex: 'articlesLimit',
      key: 'articlesLimit',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setEditingSection(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm Section mới
      </Button>

      <Table
        columns={columns}
        dataSource={sections}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingSection ? 'Sửa Section' : 'Thêm Section mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingSection(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Tên section (slug)"
            rules={[{ required: true, message: 'Vui lòng nhập tên section' }]}
          >
            <Input placeholder="vd: featured, medlatec, health" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Tiêu đề hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="vd: TIN TỨC NỔI BẬT" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} />
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
                  <Select.Option value="left">Trái</Select.Option>
                  <Select.Option value="center">Giữa</Select.Option>
                  <Select.Option value="right">Phải</Select.Option>
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
                <Input type="color" />
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
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingSection(null);
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
```

### Bước 5: Cập nhật form tạo/sửa tin tức

Trong AdminCMSPage, thêm field `sectionName` vào form tin tức:

```jsx
<Form.Item
  name="sectionName"
  label="Section"
  rules={[{ required: true, message: 'Vui lòng chọn section' }]}
>
  <Select placeholder="Chọn section">
    {newsSections.map(section => (
      <Select.Option key={section.name} value={section.name}>
        {section.title}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
```

## Cấu trúc Database

### Bảng news_sections

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(255) | Tên section (slug), unique |
| title | VARCHAR(255) | Tiêu đề hiển thị |
| description | TEXT | Mô tả section |
| display_order | INT | Thứ tự hiển thị |
| background_color | VARCHAR(50) | Màu nền |
| title_align | VARCHAR(20) | Căn lề: left, center, right |
| articles_limit | INT | Số bài viết hiển thị |
| show_more_button | BOOLEAN | Hiển thị nút xem thêm |
| more_button_text | VARCHAR(100) | Text nút xem thêm |
| is_active | BOOLEAN | Trạng thái |

### Bảng news_articles (thêm cột)

| Column | Type | Description |
|--------|------|-------------|
| section_name | VARCHAR(255) | Foreign key to news_sections.name |

## API Endpoints

### Public Endpoints

- `GET /api/cms/news-sections` - Lấy tất cả active sections
- `GET /api/cms/news-sections/{name}` - Lấy section theo name
- `GET /api/cms/news-sections/{sectionName}/articles?limit=4` - Lấy articles của section

### Admin Endpoints

- `GET /api/cms/admin/news-sections` - Lấy tất cả sections
- `GET /api/cms/admin/news-sections/{id}` - Lấy section theo ID
- `POST /api/cms/admin/news-sections` - Tạo section mới
- `PUT /api/cms/admin/news-sections/{id}` - Cập nhật section
- `DELETE /api/cms/admin/news-sections/{id}` - Xóa section

## Ví dụ sử dụng

### 1. Tạo section mới từ CMS

1. Vào Admin CMS > Tab "Sections Tin tức"
2. Click "Thêm Section mới"
3. Điền thông tin:
   - Tên: `covid-19`
   - Tiêu đề: `TIN TỨC COVID-19`
   - Thứ tự: `5`
   - Số bài viết: `6`
   - Màu nền: `#fff3cd`
   - Căn lề: `center`
4. Click "Lưu"

### 2. Gán bài viết vào section

1. Vào Admin CMS > Tab "Tin tức"
2. Tạo/Sửa bài viết
3. Chọn Section: `COVID-19`
4. Lưu bài viết

### 3. Section tự động hiển thị trên HomePage

Section sẽ tự động xuất hiện trên HomePage theo thứ tự `display_order` với:
- Tiêu đề: TIN TỨC COVID-19
- Màu nền: #fff3cd
- 6 bài viết mới nhất của section
- Căn giữa tiêu đề

## Lợi ích

1. **Linh hoạt**: Tạo không giới hạn sections
2. **Dễ quản lý**: Quản lý từ CMS, không cần code
3. **Tự động**: Sections tự động hiển thị khi có bài viết
4. **Tùy biến**: Mỗi section có thể có thiết kế riêng
5. **Performance**: Chỉ load sections active và có bài viết

## Troubleshooting

### Section không hiển thị?
- Kiểm tra `isActive = true`
- Kiểm tra có bài viết với `sectionName` tương ứng
- Kiểm tra bài viết có `isActive = true` và `status = 'APPROVED'`

### Lỗi khi tạo section?
- Kiểm tra `name` phải unique
- Kiểm tra backend đã restart sau khi chạy SQL

### Bài viết không xuất hiện trong section?
- Kiểm tra `sectionName` của bài viết khớp với `name` của section
- Kiểm tra `articlesLimit` của section

## Kết luận

Hệ thống News Sections cho phép bạn tạo trang tin tức động với nhiều sections khác nhau, tất cả được quản lý từ CMS mà không cần code thêm!
