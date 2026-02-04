import React, { useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { message } from 'antd';
import axios from 'axios';

// Custom image handler
const imageHandler = function() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Chỉ chấp nhận file ảnh!');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        message.loading({ content: 'Đang tải ảnh lên...', key: 'uploadImage' });
        
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8080/api/images/articles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        const imageUrl = response.data.imageUrl || response.data.url;
        
        // Insert image into editor
        const quill = this.quill;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1);

        message.success({ content: 'Tải ảnh lên thành công!', key: 'uploadImage' });
      } catch (error) {
        console.error('Error uploading image:', error);
        message.error({ content: 'Lỗi khi tải ảnh lên!', key: 'uploadImage' });
      }
    }
  };
};

function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }) {
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div style={{ 
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #d9d9d9'
    }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          minHeight: '400px'
        }}
      />
      <style>{`
        .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .ql-editor {
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 16px auto;
          border-radius: 8px;
        }
        .ql-editor p {
          margin-bottom: 12px;
          line-height: 1.8;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .ql-editor blockquote {
          border-left: 4px solid #1890ff;
          padding-left: 16px;
          margin: 16px 0;
          color: #666;
          font-style: italic;
        }
        .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #fafafa;
        }
        .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
