"use client";

import { useState } from "react";
import "@/styles/components/accountPage.scss";
import Image from "next/image";

export default function AccountInforPage() {
  const [password, setPassword] = useState("********");
  const [formData] = useState({
    lastName: "Thắng",
    firstName: "Ngô",
    email: "thang9a2004@gmail.com",
    phone: "0943618795",
    gender: "Nam",
    birthDay: "09",
    birthMonth: "03",
    birthYear: "2004",
    city: "Hà Nội",
    address: "hà nội",
  });

  return (
    <div className="account-page">
      <h2 className="title">Tài khoản</h2>
      <div className="account-container">
        {/* Left panel */}
        <div className="account-form">
          <div className="user-summary">
            <p className="username">Ngô Thắng</p>
            <p>
              Điểm RP: <strong>16</strong> &nbsp; Tổng visit: <strong>1</strong>
            </p>
            <p>
              Expired visit: <span className="expired">1</span> &nbsp; Active visit: <span className="active">0</span>
            </p>
            <p>Tổng chi tiêu trong tháng (7/2025): <strong>0 VNĐ</strong></p>
          </div>
          <div className="upload-note">
            Vui lòng đăng ảnh chân dung, thấy rõ mặt có kích thước: ngang 200 pixel và dọc 200 pixel (dung lượng dưới 1MB)
          </div>

          {/* Form fields */}
          <form>
            <div className="form-group">
              <div className="form-control">
                <label>Họ *</label>
                <input type="text" value={formData.lastName} />
              </div>
              <div className="form-control">
                <label>Tên đệm và tên *</label>
                <input type="text" value={formData.firstName} />
              </div>
            </div>

            <div className="form-control">
              <label>Email *</label>
              <input type="email" value={formData.email} />
            </div>

            <div className="form-group password-field">
              <div className="form-control">
                <label>Mật khẩu</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="change-password">ĐỔI MẬT KHẨU</button>
            </div>

            <div className="form-control">
              <label>Số điện thoại *</label>
              <input type="text" value={formData.phone} />
            </div>

            <div className="form-control">
              <label>Giới tính *</label>
              <select value={formData.gender}>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>

            <div className="form-control">
              <label>Ngày sinh *</label>
              <div className="form-group">
                <select value={formData.birthDay}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
                <select value={formData.birthMonth}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
                <select value={formData.birthYear}><option>2004</option></select>
              </div>
            </div>

            <div className="form-control">
              <label>Tỉnh/Thành phố *</label>
              <select value={formData.city}><option>Hà Nội</option></select>
            </div>

            <div className="form-control">
              <label>Địa chỉ *</label>
              <input type="text" value={formData.address} />
            </div>

            <button className="update-button">CẬP NHẬT</button>
          </form>
        </div>

        {/* Right panel */}
        <div className="account-info-box">
          <div className="info-header">
            <span className="delete">Xóa thông tin</span>
          </div>
          <p>Tên đăng nhập: <strong>{formData.email}</strong></p>
          <p>Số thẻ: <strong>ONLA0126219</strong></p>
          <p>Hạng thẻ: <strong>Star</strong></p>
          <p>Ngày đăng ký: <strong>24/06/2025</strong></p>
          <div className="qr-box">
            <Image
              src="/qr.png"
              alt="QR code"
              width={100}
              height={100}
              layout="responsive"
            />
          </div>
          <button className="logout">ĐĂNG XUẤT</button>
        </div>
      </div>
    </div>
  );
}
