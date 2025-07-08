# 📋 Dashboard Quản lý Hợp đồng Khám sức khỏe

## 🎯 Tổng quan
Ứng dụng Google Apps Script để quản lý hợp đồng khám sức khỏe doanh nghiệp với giao diện web hiện đại, tối giản theo triết lý "Less, but better".

## ✨ Tính năng chính
- 📊 Dashboard tổng quan với thống kê real-time
- 🔍 Tìm kiếm và lọc hợp đồng thông minh
- 📈 Báo cáo doanh thu chi tiết
- ✏️ Cập nhật trạng thái hợp đồng
- 📤 Xuất dữ liệu CSV
- 📱 Giao diện responsive, tối ưu mobile

## 🚀 Cách triển khai

### Bước 1: Chuẩn bị Google Sheet
1. Tạo Google Sheet mới hoặc sử dụng sheet hiện có
2. Đảm bảo sheet có tên `chc` và cấu trúc cột như sau:
   - A: Mã nhân viên
   - B: Mã công ty
   - C: Mã hợp đồng
   - D: Ngày ký
   - E: Trạng thái ký
   - F: Doanh thu
   - G: Số người khám
   - H: Ngày hóa đơn
   - I: Doanh thu thực hiện
   - J: Ngày bắt đầu khám

### Bước 2: Cấu hình Google Apps Script
1. Mở [Google Apps Script](https://script.google.com)
2. Tạo project mới
3. Upload tất cả files trong thư mục này
4. Cập nhật `SHEET_ID` trong file `contract_manager.js` (dòng 15)

### Bước 3: Deploy Web App
1. Trong Apps Script Editor, click **Deploy** > **New deployment**
2. Chọn type: **Web app**
3. Cấu hình:
   - Execute as: **Me**
   - Who has access: **Anyone** (hoặc theo nhu cầu bảo mật)
4. Click **Deploy**
5. Copy URL được tạo

### Bước 4: Cấp quyền
1. Lần đầu chạy, Google sẽ yêu cầu cấp quyền
2. Click **Review permissions**
3. Chọn tài khoản Google
4. Click **Allow**

## 🎨 Thiết kế UI/UX

### Nguyên tắc thiết kế
- **Tối giản**: Chỉ sử dụng màu trắng (#FFFFFF) và đen (#000000)
- **Typography**: Font system hiện đại, dễ đọc
- **Spacing**: Grid 8px, khoảng cách đều đặn
- **Responsive**: Tối ưu cho mọi thiết bị

### Cấu trúc giao diện
- **Header**: Tiêu đề và thông tin tổng quan
- **Stats Cards**: Thống kê nhanh (tổng hợp đồng, doanh thu, etc.)
- **Controls**: Tìm kiếm, lọc, các nút action
- **Data Table**: Bảng dữ liệu với pagination

## 🔧 Cấu trúc kỹ thuật

### Files chính
- `contract_manager.js`: Backend logic, API functions
- `dashboard.html`: Giao diện chính
- `revenue_report.html`: Báo cáo doanh thu
- `search.html`: Giao diện tìm kiếm
- `appsscript.json`: Cấu hình project

### API Functions
- `doGet()`: Entry point cho Web App
- `getAllContracts()`: Lấy tất cả hợp đồng
- `searchContracts()`: Tìm kiếm hợp đồng
- `getRevenueStats()`: Thống kê doanh thu
- `updateContractStatus()`: Cập nhật trạng thái
- `exportToCSV()`: Xuất dữ liệu

## 📊 Cách sử dụng

### Dashboard chính
1. Mở URL Web App
2. Xem thống kê tổng quan ở phần Stats Cards
3. Sử dụng ô tìm kiếm để lọc dữ liệu
4. Click vào hàng để xem chi tiết

### Tìm kiếm và lọc
- **Tìm kiếm tổng quát**: Nhập từ khóa vào ô search
- **Lọc theo loại**: Chọn dropdown filter
- **Kết hợp**: Có thể dùng cả search và filter

### Cập nhật dữ liệu
- Click nút "Cập nhật" trên từng hàng
- Thay đổi trạng thái hoặc doanh thu thực hiện
- Dữ liệu sẽ được lưu trực tiếp vào Google Sheet

## 🔒 Bảo mật
- Sử dụng OAuth2 của Google
- Chỉ truy cập dữ liệu được phép
- Không lưu trữ thông tin nhạy cảm
- Có thể giới hạn quyền truy cập theo domain

## 🚀 Tính năng mở rộng đề xuất

### Phase 2
- 📧 Gửi email thông báo tự động
- 📅 Tích hợp Google Calendar
- 📊 Biểu đồ visualization nâng cao
- 👥 Phân quyền theo vai trò

### Phase 3
- 🔔 Push notifications
- 📱 Progressive Web App (PWA)
- 🤖 AI insights và predictions
- 🔄 Sync với hệ thống ERP

## 🛠️ Troubleshooting

### Lỗi thường gặp
1. **"Không tìm thấy hàm doGet"**
   - Đảm bảo file `contract_manager.js` có hàm `doGet()`
   - Deploy lại Web App

2. **"Permission denied"**
   - Kiểm tra quyền truy cập Google Sheet
   - Cấp lại quyền trong Apps Script

3. **"Data not loading"**
   - Kiểm tra SHEET_ID đúng chưa
   - Đảm bảo sheet name là 'chc'
   - Kiểm tra cấu trúc cột

### Performance tips
- Sử dụng batch operations cho dữ liệu lớn
- Implement caching cho queries thường dùng
- Optimize UI rendering với pagination

## 📞 Hỗ trợ
Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser (F12)
2. Execution logs trong Apps Script Editor
3. Quyền truy cập Google Sheet
4. Cấu trúc dữ liệu đúng format

---

*Được thiết kế theo triết lý "Less, but better" - Tối giản nhưng hoàn hảo* ✨