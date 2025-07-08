# 🚀 Hướng dẫn Deploy nhanh

## ✅ Checklist trước khi deploy

### 1. Chuẩn bị Google Sheet
- [ ] Tạo/mở Google Sheet
- [ ] Đổi tên sheet thành `chc`
- [ ] Copy Sheet ID từ URL
- [ ] Cập nhật `SHEET_ID` trong `contract_manager.js` (dòng 15)

### 2. Upload code lên Apps Script
- [ ] Mở [script.google.com](https://script.google.com)
- [ ] Tạo project mới
- [ ] Upload tất cả files (.js, .html, .json)
- [ ] Save project

### 3. Deploy Web App
- [ ] Click **Deploy** > **New deployment**
- [ ] Type: **Web app**
- [ ] Execute as: **Me**
- [ ] Access: **Anyone** (hoặc theo nhu cầu)
- [ ] Click **Deploy**
- [ ] Copy URL

### 4. Test ứng dụng
- [ ] Mở URL trong browser
- [ ] Cấp quyền khi được yêu cầu
- [ ] Kiểm tra data hiển thị đúng
- [ ] Test các tính năng chính

## 🔧 Cấu hình nâng cao

### Bảo mật
```json
// Trong appsscript.json
"webapp": {
  "executeAs": "USER_DEPLOYING",
  "access": "DOMAIN"  // Chỉ domain công ty
}
```

### Performance
```javascript
// Trong contract_manager.js
const CONFIG = {
  CACHE_DURATION: 300, // 5 phút
  MAX_ROWS: 1000,      // Giới hạn rows
  BATCH_SIZE: 100      // Batch processing
};
```

## 🐛 Fix lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| "doGet not found" | Thiếu hàm doGet() | Đã fix trong code |
| "Permission denied" | Chưa cấp quyền | Review permissions |
| "Sheet not found" | Sai tên sheet | Đổi tên thành 'chc' |
| "Data empty" | Sai SHEET_ID | Cập nhật ID đúng |

## 📱 URL mẫu
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**Lưu ý**: Thay `YOUR_DEPLOYMENT_ID` bằng ID thực tế sau khi deploy.

---

⏱️ **Thời gian deploy**: ~10 phút  
🎯 **Mục tiêu**: Ứng dụng chạy mượt mà, giao diện đẹp, dữ liệu chính xác