"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import "@/styles/components/register.scss";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email,
        full_name: fullName,
        password,
        gender,
        phone_number: phoneNumber,
        birthday,
        address,
      });

      setSuccess("Đăng ký thành công!");
      setError("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      setSuccess("");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="background-image">
        <Image src="/banner/login.jpg" alt="Background" fill priority />
      </div>
      <div className="register-card">
        <h2>Đăng ký tài khoản</h2>
        <p>Tạo tài khoản mới</p>

        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="text"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <div className="form-row">
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              autoComplete="off"
              required
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>

            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <input
            type="date"
            placeholder="Ngày sinh"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
            required
          />

          <button type="submit">Đăng ký</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="links">
          <a href="/login">Đã có tài khoản? Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
