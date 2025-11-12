// 📁 hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.withCredentials = true;

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra /auth/me khi load trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/me', {
          withCredentials: true,
        });
        
        // Nếu là admin thì clear cookie và không cho phép đăng nhập ở customer
        if (res.data?.role === 'admin') {
          // Clear cookie
          await axios.post('http://localhost:3000/auth/logout', null, {
            withCredentials: true,
          });
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setUser(null);
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }
        
        // Chỉ cho phép customer
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      await axios.post('http://localhost:3000/auth/login', { email, password }, {
        withCredentials: true,
      });

      const res = await axios.get('http://localhost:3000/auth/me', {
        withCredentials: true,
      });

      // Kiểm tra role, chỉ cho phép customer
      if (res.data?.role === 'admin') {
        // Nếu là admin thì clear cookie và throw error
        await axios.post('http://localhost:3000/auth/logout', null, {
          withCredentials: true,
        });
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        throw new Error('Tài khoản admin không thể đăng nhập ở đây. Vui lòng đăng nhập tại trang admin.');
      }

      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      router.push('/');
    } catch (err) {
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', null, {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Refresh user data (for updating avatar, profile, etc.)
  const refetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/me', {
        withCredentials: true,
      });
      
      // Kiểm tra role, chỉ cho phép customer
      if (res.data?.role === 'admin') {
        // Nếu là admin thì clear cookie
        await axios.post('http://localhost:3000/auth/logout', null, {
          withCredentials: true,
        });
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        localStorage.removeItem('user');
        return;
      }
      
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refetch user:', err);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    refetchUser,
    isAuthenticated: !!user,
  };
}
