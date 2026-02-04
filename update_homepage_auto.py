#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động cập nhật HomePage.js để loại bỏ hardcode
"""

import re

def update_homepage():
    # Đọc file
    with open('frontend/src/pages/HomePage.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Đang cập nhật HomePage.js...")
    
    # 1. Xóa defaultSpecialties array
    content = re.sub(
        r'const defaultSpecialties = \[[\s\S]*?\];',
        '',
        content
    )
    print("✅ Đã xóa defaultSpecialties")
    
    # 2. Xóa defaultNewsArticles array  
    content = re.sub(
        r'const defaultNewsArticles = \[[\s\S]*?\];',
        '',
        content
    )
    print("✅ Đã xóa defaultNewsArticles")
    
    # 3. Thay thế specialties.map thành specialties.length > 0 ? specialties.map
    content = content.replace(
        '{specialties.map((specialty, index) => (',
        '{specialties.length > 0 ? specialties.map((specialty, index) => ('
    )
    
    # Thêm fallback cho specialties
    content = content.replace(
        '            ))}',
        '            )) : (\n              <div style={{ padding: 40, textAlign: \'center\', gridColumn: \'1 / -1\' }}>\n                <Paragraph>Chưa có dữ liệu chuyên khoa</Paragraph>\n              </div>\n            )}'
    )
    print("✅ Đã cập nhật Specialties section")
    
    # Lưu file
    with open('frontend/src/pages/HomePage.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Hoàn thành! File HomePage.js đã được cập nhật.")
    print("Frontend sẽ tự động reload.")

if __name__ == '__main__':
    try:
        update_homepage()
    except Exception as e:
        print(f"❌ Lỗi: {e}")
