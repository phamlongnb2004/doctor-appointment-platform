# About Page CMS Interface - Complete Code

## Thêm vào AdminCMSPage.js

### 1. Add to imports (nếu chưa có)
```javascript
import { InfoCircleOutlined } from '@ant-design/icons';
```

### 2. Add states (trong component)
```javascript
// About Page states
const [aboutHero, setAboutHero] = useState(null);
const [aboutMission, setAboutMission] = useState(null);
const [aboutValues, setAboutValues] = useState([]);
const [aboutAchievements, setAboutAchievements] = useState([]);
const [aboutTimeline, setAboutTimeline] = useState([]);
const [aboutTeam, setAboutTeam] = useState([]);
const [aboutSubTab, setAboutSubTab] = useState('hero');
```

### 3. Add to fetchAllData()
```javascript
const fetchAllData = async () => {
  // ... existing code ...
  
  // Fetch About Page data
  try {
    const aboutSections = await cmsAPI.getAllAboutSections();
    aboutSections.data.forEach(section => {
      const content = JSON.parse(section.contentJson);
      switch(section.sectionKey) {
        case 'hero':
          setAboutHero(content);
          break;
        case 'mission':
          setAboutMission(content);
          break;
        case 'values':
          setAboutValues(content);
          break;
        case 'achievements':
          setAboutAchievements(content);
          break;
        case 'timeline':
          setAboutTimeline(content);
          break;
        case 'team':
          setAboutTeam(content);
          break;
      }
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
  }
};
```

### 4. Add menu item (trong Sider Menu)
```javascript
<Menu.ItemGroup title="Trang giới thiệu">
  <Menu.Item key="about-page" icon={<InfoCircleOutlined />}>
    Trang giới thiệu
  </Menu.Item>
</Menu.ItemGroup>
```

### 5. Add case trong renderContent()
```javascript
case 'about-page':
  return renderAboutPageCMS();
```

### 6. Add renderAboutPageCMS function
```javascript
const renderAboutPageCMS = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs activeKey={aboutSubTab} onChange={setAboutSubTab}>
          <TabPane tab="Hero Section" key="hero">
            {renderAboutHeroForm()}
          </TabPane>
          <TabPane tab="Mission & Vision" key="mission">
            {renderAboutMissionForm()}
          </TabPane>
          <TabPane tab="Core Values" key="values">
            {renderAboutValuesTable()}
          </TabPane>
          <TabPane tab="Achievements" key="achievements">
            {renderAboutAchievementsTable()}
          </TabPane>
          <TabPane tab="Timeline" key="timeline">
            {renderAboutTimelineTable()}
          </TabPane>
          <TabPane tab="Team" key="team">
            {renderAboutTeamTable()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
```

### 7. Hero Form
```javascript
const renderAboutHeroForm = () => {
  const [heroForm] = Form.useForm();
  
  useEffect(() => {
    if (aboutHero) {
      heroForm.setFieldsValue(aboutHero);
    }
  }, [aboutHero]);
  
  const handleSaveHero = async () => {
    try {
      const values = await heroForm.validateFields();
      await cmsAPI.saveAboutSection('hero', {
        sectionKey: 'hero',
        contentJson: JSON.stringify(values),
        isActive: true
      });
      message.success('Đã lưu Hero Section!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi lưu!');
    }
  };
  
  return (
    <Form form={heroForm} layout="vertical">
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input placeholder="Về chúng tôi" />
      </Form.Item>
      <Form.Item name="subtitle" label="Phụ đề">
        <TextArea rows={2} placeholder="Hệ thống Y tế chất lượng cao" />
      </Form.Item>
      <Form.Item name="backgroundImage" label="Ảnh nền">
        <Input placeholder="URL ảnh nền" />
      </Form.Item>
      <Button type="primary" onClick={handleSaveHero}>
        Lưu thay đổi
      </Button>
    </Form>
  );
};
```

### 8. Mission Form
```javascript
const renderAboutMissionForm = () => {
  const [missionForm] = Form.useForm();
  
  useEffect(() => {
    if (aboutMission) {
      missionForm.setFieldsValue(aboutMission);
    }
  }, [aboutMission]);
  
  const handleSaveMission = async () => {
    try {
      const values = await missionForm.validateFields();
      await cmsAPI.saveAboutSection('mission', {
        sectionKey: 'mission',
        contentJson: JSON.stringify(values),
        isActive: true
      });
      message.success('Đã lưu Mission Section!');
      fetchAllData();
    } catch (error) {
      message.error('Lỗi khi lưu!');
    }
  };
  
  return (
    <Form form={missionForm} layout="vertical">
      <Form.Item name="label" label="Label">
        <Input placeholder="SỨ MỆNH CỦA CHÚNG TÔI" />
      </Form.Item>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input placeholder="Mang đến dịch vụ y tế chất lượng cao" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item name="imageUrl" label="Hình ảnh">
        <Input placeholder="URL hình ảnh" />
      </Form.Item>
      <Form.Item name={['features', 0]} label="Feature 1">
        <Input />
      </Form.Item>
      <Form.Item name={['features', 1]} label="Feature 2">
        <Input />
      </Form.Item>
      <Form.Item name={['features', 2]} label="Feature 3">
        <Input />
      </Form.Item>
      <Button type="primary" onClick={handleSaveMission}>
        Lưu thay đổi
      </Button>
    </Form>
  );
};
```

### 9. Values Table (Simple version)
```javascript
const renderAboutValuesTable = () => {
  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Icon', dataIndex: 'icon', key: 'icon' },
    { title: 'Màu sắc', dataIndex: 'color', key: 'color',
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: color, borderRadius: 4 }} />
          <span>{color}</span>
        </div>
      )
    }
  ];
  
  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        Thêm giá trị
      </Button>
      <Table 
        dataSource={aboutValues} 
        columns={columns}
        rowKey={(record, index) => index}
      />
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Để chỉnh sửa, vui lòng edit trực tiếp trong database hoặc sử dụng JSON editor
        </Text>
      </div>
    </div>
  );
};
```

### 10. Similar for other tables
```javascript
const renderAboutAchievementsTable = () => {
  // Similar structure to Values
  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
    { title: 'Suffix', dataIndex: 'suffix', key: 'suffix' },
    { title: 'Icon', dataIndex: 'icon', key: 'icon' }
  ];
  
  return (
    <Table 
      dataSource={aboutAchievements} 
      columns={columns}
      rowKey={(record, index) => index}
    />
  );
};

const renderAboutTimelineTable = () => {
  const columns = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' }
  ];
  
  return (
    <Table 
      dataSource={aboutTimeline} 
      columns={columns}
      rowKey={(record, index) => index}
    />
  );
};

const renderAboutTeamTable = () => {
  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
    { title: 'Chuyên khoa', dataIndex: 'specialty', key: 'specialty' },
    { title: 'Avatar', dataIndex: 'avatarUrl', key: 'avatarUrl',
      render: (url) => url ? <Avatar src={url} /> : <Avatar icon={<UserOutlined />} />
    }
  ];
  
  return (
    <Table 
      dataSource={aboutTeam} 
      columns={columns}
      rowKey={(record, index) => index}
    />
  );
};
```

## 📝 Notes

- Hero và Mission có form đầy đủ để edit
- Values, Achievements, Timeline, Team hiển thị dạng table (read-only)
- Để edit các arrays, có thể:
  1. Edit trực tiếp trong database
  2. Thêm modal forms (advanced)
  3. Sử dụng JSON editor component

## ✅ Implementation Complete

Với code trên, CMS sẽ có:
- ✅ Tab "Trang giới thiệu"
- ✅ 6 sub-tabs cho từng section
- ✅ Forms để edit Hero và Mission
- ✅ Tables để xem Values, Achievements, Timeline, Team
- ✅ Save functionality với API integration

## 🚀 To Use

1. Copy code vào AdminCMSPage.js
2. Restart frontend nếu cần
3. Vào Admin CMS → Trang giới thiệu
4. Edit và save!
