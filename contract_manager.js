/**
 * Contract Health Check Manager - Google Apps Script
 * Quản lý hợp đồng khám sức khỏe doanh nghiệp
 * 
 * Tính năng:
 * - Đọc dữ liệu từ Google Sheets
 * - Hiển thị danh sách hợp đồng
 * - Tìm kiếm và lọc hợp đồng
 * - Cập nhật trạng thái thực hiện
 * - Báo cáo doanh thu
 */

// ===== CẤU HÌNH =====
const CONFIG = {
  SHEET_ID: '15eMfEvqNvy1qBNG1NXwr7eSBsYZA6KqlBB3lTyzTfhM', // Thay bằng ID của Google Sheet
  SHEET_NAME: 'chc',
  COLUMNS: {
    MA_NHAN_VIEN: 0,
    MA_CONG_TY: 1,
    MA_HOP_DONG: 2,
    NGAY_KY: 3,
    TRANG_THAI_KY: 4,
    DOANH_THU: 5,
    SO_NGUOI_KHAM: 6,
    NGAY_HOA_DON: 7,
    DOANH_THU_THUC_HIEN: 8,
    NGAY_BAT_DAU_KHAM: 9
  }
};

// ===== WEB APP FUNCTIONS =====
function doGet() {
  return HtmlService.createTemplateFromFile('dashboard')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('📋 Dashboard Quản lý Hợp đồng CHC');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ===== MENU FUNCTIONS =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Quản lý Hợp đồng')
    .addItem('🏠 Mở Dashboard', 'openDashboard')
    .addItem('📊 Báo cáo Doanh thu', 'openRevenueReport')
    .addItem('🔍 Tìm kiếm Hợp đồng', 'openSearchDialog')
    .addSeparator()
    .addItem('⚙️ Cài đặt', 'openSettings')
    .addToUi();
}

// ===== MAIN FUNCTIONS =====
function openDashboard() {
  const html = HtmlService.createTemplateFromFile('dashboard')
    .evaluate()
    .setWidth(1200)
    .setHeight(800)
    .setTitle('📋 Dashboard Quản lý Hợp đồng');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Dashboard');
}

function openRevenueReport() {
  const html = HtmlService.createTemplateFromFile('revenue_report')
    .evaluate()
    .setWidth(1000)
    .setHeight(700)
    .setTitle('📊 Báo cáo Doanh thu');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Báo cáo Doanh thu');
}

function openSearchDialog() {
  const html = HtmlService.createTemplateFromFile('search')
    .evaluate()
    .setWidth(800)
    .setHeight(600)
    .setTitle('🔍 Tìm kiếm Hợp đồng');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Tìm kiếm');
}

// ===== DATA FUNCTIONS =====
function getAllContracts() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) return [];
    
    const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
    
    return data.map((row, index) => ({
      id: index + 2, // Row number
      maNhanVien: row[CONFIG.COLUMNS.MA_NHAN_VIEN],
      maCongTy: row[CONFIG.COLUMNS.MA_CONG_TY],
      maHopDong: row[CONFIG.COLUMNS.MA_HOP_DONG],
      ngayKy: formatDate(row[CONFIG.COLUMNS.NGAY_KY]),
      trangThaiKy: row[CONFIG.COLUMNS.TRANG_THAI_KY],
      doanhThu: formatCurrency(row[CONFIG.COLUMNS.DOANH_THU]),
      soNguoiKham: row[CONFIG.COLUMNS.SO_NGUOI_KHAM],
      ngayHoaDon: formatDate(row[CONFIG.COLUMNS.NGAY_HOA_DON]),
      doanhThuThucHien: formatCurrency(row[CONFIG.COLUMNS.DOANH_THU_THUC_HIEN]),
      ngayBatDauKham: formatDate(row[CONFIG.COLUMNS.NGAY_BAT_DAU_KHAM])
    }));
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu:', error);
    return [];
  }
}

function searchContracts(searchTerm, filterType = 'all') {
  const allContracts = getAllContracts();
  
  if (!searchTerm) return allContracts;
  
  const term = searchTerm.toLowerCase();
  
  return allContracts.filter(contract => {
    switch (filterType) {
      case 'company':
        return contract.maCongTy.toLowerCase().includes(term);
      case 'employee':
        return contract.maNhanVien.toLowerCase().includes(term);
      case 'contract':
        return contract.maHopDong.toLowerCase().includes(term);
      case 'status':
        return contract.trangThaiKy.toLowerCase().includes(term);
      default:
        return (
          contract.maCongTy.toLowerCase().includes(term) ||
          contract.maNhanVien.toLowerCase().includes(term) ||
          contract.maHopDong.toLowerCase().includes(term) ||
          contract.trangThaiKy.toLowerCase().includes(term)
        );
    }
  });
}

function getRevenueStats() {
  const contracts = getAllContracts();
  
  const stats = {
    totalContracts: contracts.length,
    totalRevenue: 0,
    totalPeople: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    statusBreakdown: {},
    employeeStats: {},
    monthlyRevenue: {}
  };
  
  contracts.forEach(contract => {
    // Tổng doanh thu
    const revenue = parseCurrency(contract.doanhThu);
    const completedRevenue = parseCurrency(contract.doanhThuThucHien);
    
    stats.totalRevenue += revenue;
    stats.totalPeople += contract.soNguoiKham || 0;
    
    if (completedRevenue > 0) {
      stats.completedRevenue += completedRevenue;
    } else {
      stats.pendingRevenue += revenue;
    }
    
    // Thống kê theo trạng thái
    const status = contract.trangThaiKy || 'Chưa xác định';
    stats.statusBreakdown[status] = (stats.statusBreakdown[status] || 0) + 1;
    
    // Thống kê theo nhân viên
    const employee = contract.maNhanVien;
    if (!stats.employeeStats[employee]) {
      stats.employeeStats[employee] = { contracts: 0, revenue: 0 };
    }
    stats.employeeStats[employee].contracts++;
    stats.employeeStats[employee].revenue += revenue;
    
    // Thống kê theo tháng
    if (contract.ngayKy) {
      const month = contract.ngayKy.substring(0, 7); // YYYY-MM
      stats.monthlyRevenue[month] = (stats.monthlyRevenue[month] || 0) + revenue;
    }
  });
  
  return stats;
}

function updateContractStatus(contractId, newStatus, completedRevenue) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    
    // Cập nhật trạng thái
    if (newStatus) {
      sheet.getRange(contractId, CONFIG.COLUMNS.TRANG_THAI_KY + 1).setValue(newStatus);
    }
    
    // Cập nhật doanh thu thực hiện
    if (completedRevenue !== undefined) {
      sheet.getRange(contractId, CONFIG.COLUMNS.DOANH_THU_THUC_HIEN + 1).setValue(completedRevenue);
    }
    
    return { success: true, message: 'Cập nhật thành công' };
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    return { success: false, message: 'Lỗi: ' + error.message };
  }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}

function formatCurrency(amount) {
  if (!amount || amount === 0) return '';
  if (typeof amount === 'string') return amount;
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

function parseCurrency(currencyString) {
  if (!currencyString) return 0;
  if (typeof currencyString === 'number') return currencyString;
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, '')) || 0;
}

// ===== EXPORT FUNCTIONS =====
function exportToCSV() {
  const contracts = getAllContracts();
  const csvContent = convertToCSV(contracts);
  
  const blob = Utilities.newBlob(csvContent, 'text/csv', 'hop_dong_kham_suc_khoe.csv');
  const file = DriveApp.createFile(blob);
  
  return {
    success: true,
    fileUrl: file.getUrl(),
    fileName: file.getName()
  };
}

function convertToCSV(data) {
  const headers = [
    'Mã NV', 'Mã Công ty', 'Mã Hợp đồng', 'Ngày ký', 'Trạng thái',
    'Doanh thu', 'Số người khám', 'Ngày hóa đơn', 'DT thực hiện', 'Ngày bắt đầu khám'
  ];
  
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = [
      row.maNhanVien,
      `"${row.maCongTy}"`,
      row.maHopDong,
      row.ngayKy,
      row.trangThaiKy,
      `"${row.doanhThu}"`,
      row.soNguoiKham,
      row.ngayHoaDon,
      `"${row.doanhThuThucHien}"`,
      row.ngayBatDauKham
    ];
    csv += values.join(',') + '\n';
  });
  
  return csv;
}