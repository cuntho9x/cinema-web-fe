// 📁 components/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '@/styles/components/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCartShopping,
  faUser,
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import useAuth from '@/hooks/useAuth';

const userMenu = [
  { to: '/account/infor', icon: <FontAwesomeIcon icon={faUser} />, title: 'Manage My Account' },
  { to: '/account/orders', icon: <FontAwesomeIcon icon={faCartShopping} />, title: 'My Order' },
  // { to: '/logout', icon: <FontAwesomeIcon icon={faSignOutAlt} />, title: 'Logout' }
];

type Movie = {
  movie_id: number;
  movie_title: string;
  movie_title_url: string;
  movie_poster: string | null;
};

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/movie?search=${encodeURIComponent(searchQuery.trim())}`,
            { cache: 'no-store' }
          );
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Error searching movies:', error);
          setSearchResults([]);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Kiểm tra role khi user thay đổi, nếu là admin thì logout
  useEffect(() => {
    if (user && user.role === 'admin') {
      // Nếu user là admin thì logout ngay lập tức
      logout();
    }
  }, [user, logout]);

  const handleMovieClick = (slug: string) => {
    setSearchQuery('');
    setShowResults(false);
    router.push(`/movie/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleMovieClick(searchResults[0].movie_title_url);
    }
  };
  return (
    <header className="header">
      <div className="inner">
        {/* Logo */}
        <div className="logo-link">
          <Link href="/">
            <Image src="/catalog/logo.jpg" alt="Film Logo" width={120} height={120} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <div className="nav-item">
            <Link href="" className="header-link">
              Phim
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
            </Link>
            <ul className="dropdown">
              <li><Link href="/movie/movieShowing">Phim Đang Chiếu</Link></li>
              <li><Link href="/movie/movieComming">Phim Sắp Chiếu</Link></li>
            </ul>
          </div>

          <div className="nav-item">
            <Link className="header-link" href="/food">
              Đồ Ăn & Nước
            </Link>
          </div>

          <div className="nav-item">
            <Link href="" className="header-link">
              Sự Kiện
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
            </Link>
            <ul className="dropdown">
              <li><Link href="/events/promotions">Ưu Đãi</Link></li>
              <li><Link href="/events/hot-movies">Phim Hot Tháng</Link></li>
              {/* <li><Link href="/events/highlight">Sự Kiện Nổi Bật</Link></li> */}
            </ul>
          </div>

          <div className="nav-item">
            <Link href="/theater" className="header-link">
              Rạp / GiáVé
              {/* <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" /> */}
            </Link>
            {/* <ul className="dropdown">
              <li><Link href="/cinemas/cauGiay">Rạp Cầu Giấy</Link></li>
              <li><Link href="/cinemas/bachKhoa">Rạp Bách Khoa</Link></li>
              <li><Link href="/cinemas/thanhXuan">Rạp Thanh Xuân</Link></li>
            </ul> */}
          </div>
        </nav>

        {/* Search Bar */}
        <div className="search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Tìm phim, rạp, sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true);
                }
              }}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </form>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.slice(0, 5).map((movie) => {
                // Format image path for Next.js Image component
                let posterSrc = '/movie/default-movie-poster.jpg';
                if (movie.movie_poster) {
                  if (movie.movie_poster.startsWith('http://') || movie.movie_poster.startsWith('https://')) {
                    posterSrc = movie.movie_poster;
                  } else if (movie.movie_poster.startsWith('/')) {
                    posterSrc = movie.movie_poster.startsWith('/movie/') ? movie.movie_poster : `/movie${movie.movie_poster}`;
                  } else {
                    posterSrc = `/movie/${movie.movie_poster}`;
                  }
                }
                
                return (
                  <div
                    key={movie.movie_id}
                    className="search-result-item"
                    onClick={() => handleMovieClick(movie.movie_title_url)}
                  >
                    <Image
                      src={posterSrc}
                      alt={movie.movie_title}
                      width={50}
                      height={70}
                      className="result-poster"
                    />
                    <span className="result-title">{movie.movie_title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="action">
          {/* Người dùng */}
          {user ? (
            <div className="user">
              {(() => {
                let avatarSrc = '/user/default-avatar.png';
                if (!avatarError && user.avatar_img) {
                  if (user.avatar_img.startsWith('http') || user.avatar_img.startsWith('data:')) {
                    avatarSrc = user.avatar_img;
                  } else if (user.avatar_img.startsWith('/')) {
                    avatarSrc = user.avatar_img;
                  } else {
                    avatarSrc = `/user/${user.avatar_img}`;
                  }
                }
                console.log('🔍 Header Avatar Debug:', {
                  avatar_img: user.avatar_img,
                  avatarSrc,
                  avatarError
                });
                return (
                  <Image
                    src={avatarSrc}
                    className="user-avatar"
                    alt={user.full_name}
                    width={40}
                    height={40}
                    unoptimized
                    onError={(e) => {
                      console.error('❌ Header Avatar Error:', avatarSrc, e);
                      setAvatarError(true);
                    }}
                    onLoad={() => console.log('✅ Header Avatar Loaded:', avatarSrc)}
                  />
                );
              })()}
              <ul className="user-menu">
                {userMenu.map((item, index) => (
                  <li key={index}>
                    <Link href={item.to}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
                <li onClick={logout} style={{ cursor: 'pointer' }}>
                  {<FontAwesomeIcon icon={faSignOutAlt} />}
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="signin-btn">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}

