"use client";

import React, { useState, useEffect } from "react";
import "@/styles/components/login.scss";
import Image from "next/image";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Kiểm tra nếu đã đăng nhập với role admin thì clear cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userRes = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true,
        });
        
        // Nếu là admin thì clear cookie và yêu cầu đăng nhập lại
        if (userRes.data?.role === "admin") {
          await axios.post("http://localhost:3000/auth/logout", null, {
            withCredentials: true,
          });
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          localStorage.removeItem("user");
        } else if (userRes.data?.role === "customer") {
          // Nếu là customer thì redirect về trang chủ
          window.location.href = "/";
        }
      } catch (err) {
        // Không có token hoặc token không hợp lệ, không làm gì
      }
    };
    
    checkAuth();
  }, []);

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

      // Kiểm tra role, chỉ cho phép customer
      if (userRes.data?.role === "admin") {
        // Nếu là admin thì clear cookie và báo lỗi
        await axios.post("http://localhost:3000/auth/logout", null, {
          withCredentials: true,
        });
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setError("Tài khoản admin không thể đăng nhập ở đây. Vui lòng đăng nhập tại trang admin.");
        return;
      }

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
        <Image src="/banner/login.jpg" alt="Background" fill priority />
      </div>

      <div className="login-card">
        <h2>Đăng Nhập Tài Khoản</h2>
        <p>Chào mừng bạn quay lại!</p>

        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Đăng nhập</button>
        </form>

        <div className="links">
          <a href="#">Quên mật khẩu?</a>
          <a href="/register">Tạo tài khoản</a>
        </div>
      </div>
    </div>
  );
}
