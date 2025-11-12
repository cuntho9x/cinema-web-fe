"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/components/accountPage.scss";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

type UserData = {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  gender: 'male' | 'female';
  birthday: string | null;
  address: string | null;
  role: string;
  avatar_img: string | null;
  created_at: string;
  registered_at: string;
};

type Statistics = {
  totalPayment: number;
  rpPoints: number;
  totalOrders: number;
};

export default function AccountInforPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarError2, setAvatarError2] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    gender: "male" as 'male' | 'female',
    birthday: "",
    address: "",
    avatar_img: "",
  });

  // Lấy thông tin user và statistics khi component mount
  useEffect(() => {
    let mounted = true;
    
    async function fetchUserData() {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://localhost:3000/account/me', {
          withCredentials: true,
        });
        
        if (!mounted) return;
        
        const data: UserData = userResponse.data;
        setUserData(data);
        
        // Cập nhật formData với dữ liệu từ API
        setFormData({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "male",
          birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : "",
          address: data.address || "",
          avatar_img: data.avatar_img || "",
        });

        // Fetch statistics
        try {
          const statsResponse = await axios.get('http://localhost:3000/order/statistics', {
            withCredentials: true,
          });
          
          if (!mounted) return;
          
          console.log('📊 Statistics received:', statsResponse.data);
          setStatistics(statsResponse.data);
        } catch (statsErr: any) {
          console.error('❌ Error fetching statistics:', statsErr);
          console.error('Response:', statsErr.response?.data);
          // Set default values if statistics fail
          setStatistics({
            totalPayment: 0,
            rpPoints: 0,
            totalOrders: 0,
          });
        }
        
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        
        console.error('Error fetching user data:', err);
        setError('Không thể tải thông tin người dùng');
        setLoading(false);
        
        // Nếu không có token, redirect về login
        if (err.response?.status === 401) {
          router.push('/login');
        }
      }
    }

    fetchUserData();
    
    return () => {
      mounted = false;
    };
  }, [router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 1MB!');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar upload separately
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert('Vui lòng chọn ảnh trước!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axios.post(
        'http://localhost:3000/account/me/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      setUserData(response.data.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Refresh user data in Header and other components
      await refetchUser();
      
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert('Lỗi khi upload ảnh: ' + (err.response?.data?.message || 'Vui lòng thử lại'));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload avatar first if selected
      if (avatarFile) {
        await handleAvatarUpload();
      }
      
      // Then update other info
      const response = await axios.put(
        'http://localhost:3000/account/me',
        formData,
        { withCredentials: true }
      );
      
      setUserData(response.data);
      
      // Refresh user data in Header and other components
      await refetchUser();
      
      alert('Cập nhật thông tin thành công!');
    } catch (err: any) {
      console.error('Error updating user data:', err);
      alert('Lỗi khi cập nhật thông tin: ' + (err.response?.data?.message || 'Vui lòng thử lại'));
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('vi-VN');
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="account-page">
        <h2 className="title">Tài khoản</h2>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="account-page">
        <h2 className="title">Tài khoản</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>{error || 'Không thể tải thông tin người dùng'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <h2 className="title">Tài khoản</h2>
      <div className="account-container">
        {/* Left panel */}
        <div className="account-form">
          <div className="user-summary">
            <p className="username">{userData.full_name}</p>
            {statistics ? (
              <>
                <p>
                  Điểm RP: <strong>{statistics.rpPoints.toLocaleString('vi-VN')}</strong>
                </p>
                <p>
                  Tổng tiền đã thanh toán: <strong>{statistics.totalPayment.toLocaleString('vi-VN')} VNĐ</strong>
                </p>
                <p>
                  Tổng số đơn hàng: <strong>{statistics.totalOrders}</strong>
                </p>
              </>
            ) : (
              <p>Đang tải thống kê...</p>
            )}
          </div>
          
          {/* Avatar Upload */}
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Preview"
                  width={150}
                  height={150}
                  unoptimized
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : userData.avatar_img && !avatarError ? (
                <Image
                  src={(() => {
                    const avatarSrc = userData.avatar_img.startsWith('http') || userData.avatar_img.startsWith('data:') 
                      ? userData.avatar_img 
                      : userData.avatar_img.startsWith('/')
                      ? userData.avatar_img
                      : `/user/${userData.avatar_img}`;
                    console.log('🔍 Account Avatar Debug:', {
                      avatar_img: userData.avatar_img,
                      avatarSrc,
                      avatarError
                    });
                    return avatarSrc;
                  })()}
                  alt="Avatar"
                  width={150}
                  height={150}
                  unoptimized
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => {
                    console.error('❌ Account Avatar Error:', userData.avatar_img, e);
                    setAvatarError(true);
                  }}
                  onLoad={() => console.log('✅ Account Avatar Loaded:', userData.avatar_img)}
                />
              ) : (
                <div className="no-avatar">
                  {userData.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload" className="upload-btn">
              Chọn ảnh đại diện
            </label>
            {avatarFile && (
              <button
                type="button"
                onClick={handleAvatarUpload}
                className="upload-submit-btn"
              >
                Upload ngay
              </button>
            )}
          </div>
          
          <div className="upload-note">
            Vui lòng đăng ảnh chân dung, thấy rõ mặt có kích thước: ngang 200 pixel và dọc 200 pixel (dung lượng dưới 1MB)
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>Họ và tên *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label>Email *</label>
              <input
                type="email"
                value={userData.email}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>Email không thể thay đổi</small>
            </div>

            <div className="form-group password-field">
              <div className="form-control">
                <label>Mật khẩu</label>
                <input type="password" value="********" readOnly style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
              </div>
              <button type="button" className="change-password">ĐỔI MẬT KHẨU</button>
            </div>

            <div className="form-control">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control">
              <label>Giới tính *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="form-control">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="update-button">CẬP NHẬT</button>
          </form>
        </div>

        {/* Right panel */}
        <div className="account-info-box">
          <div className="info-header">
            <span className="delete">Thông tin tài khoản</span>
          </div>
          <p>Tên đăng nhập: <strong>{userData.email}</strong></p>
          <p>Vai trò: <strong>{userData.role}</strong></p>
          <p>Ngày đăng ký: <strong>{formatDate(userData.registered_at)}</strong></p>
          <p>Giới tính: <strong>{userData.gender === 'male' ? 'Nam' : 'Nữ'}</strong></p>
          {userData.birthday && (
            <p>Ngày sinh: <strong>{formatDate(userData.birthday)}</strong></p>
          )}
        
          <button className="logout" onClick={() => {
            axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true })
              .then(() => {
                router.push('/login');
              })
              .catch(() => {
                router.push('/login');
              });
          }}>ĐĂNG XUẤT</button>
        </div>
      </div>
    </div>
  );
}
