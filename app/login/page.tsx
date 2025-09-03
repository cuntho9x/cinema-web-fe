"use client";

import React, { useState } from "react";
import "@/styles/components/login.scss";
import Image from "next/image";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      { email, password },
      { withCredentials: true } // 👉 Rất quan trọng: dùng cookie thay vì lưu token tay
    );

    // Không cần lấy token nữa vì BE đã set cookie
    console.log("LOGIN RESPONSE:", response.data);

    // Gọi /auth/me để lấy thông tin người dùng
    const userRes = await axios.get("http://localhost:3000/auth/me", {
      withCredentials: true, // 👉 Cần để gửi cookie đi cùng
    });

    console.log("USER INFO:", userRes.data);

    // Lưu user vào localStorage (nếu muốn dùng ở client)
    localStorage.setItem("user", JSON.stringify(userRes.data));

    window.location.href = "/";
  } catch (err: any) {
    console.error("FULL ERROR:", err);
    console.error("Login failed:", err.response?.data || err.message);
    setError(
      err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin."
    );
  }
};


  return (
    <div className="login-wrapper">
      <div className="background-image">
        <Image src="/login.jpg" alt="Background" fill priority />
      </div>

      <div className="login-card">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p>Chào mừng bạn quay lại!</p>

        <input
          type="text"
          placeholder="Email hoặc số điện thoại"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleLogin}>Đăng nhập</button>

        <div className="links">
          <a href="#">Quên mật khẩu?</a>
          <a href="/register">Tạo tài khoản</a>
        </div>
      </div>
    </div>
  );
}
