// 📁 components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/components/Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCartShopping,
  faUser,
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const userMenu = [
  { to: '/account/infor', icon: <FontAwesomeIcon icon={faUser} />, title: 'Manage My Account' },
  { to: '/account/orders', icon: <FontAwesomeIcon icon={faCartShopping} />, title: 'My Order' },
  { to: '/logout', icon: <FontAwesomeIcon icon={faSignOutAlt} />, title: 'Logout' }
];

export default function Header() {
  return (
    <header className="header">
      <div className="inner">
        {/* Logo */}
        <div className="logo-link">
          <Link href="/">
            <Image src="/logo.jpg" alt="Film Logo" width={120} height={120} />
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
            <Link className="header-link" href="/products">
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
        <div className="search">
          <input type="text" placeholder="Tìm phim, rạp, sự kiện..." />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        {/* Action buttons */}
        <div className="action">
          {/* Người dùng */}
          <div className="user">
            <Image
              src="/avatar.JPG"
              className="user-avatar"
              alt="Ngô Đức Thắng"
              width={40}
              height={40}
            />

            <ul className="user-menu">
              {userMenu.map((item, index) => (
                <li key={index}>
                  <Link href={item.to}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

