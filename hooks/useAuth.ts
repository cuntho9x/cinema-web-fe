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

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
