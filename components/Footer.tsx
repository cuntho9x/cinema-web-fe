'use client'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import '@/styles/components/Footer.scss';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>GIỚI THIỆU</h4>
          <ul>
            <li><Link href="#">Về Chúng Tôi</Link></li>
            <li><Link href="#">Thoả Thuận Sử Dụng</Link></li>
            <li><Link href="#">Quy Chế Hoạt Động</Link></li>
            <li><Link href="#">Chính Sách Bảo Mật</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>GÓC ĐIỆN ẢNH</h4>
          <ul>
            <li><Link href="#">Thể Loại Phim</Link></li>
            <li><Link href="#">Bình Luận Phim</Link></li>
            <li><Link href="#">Blog Điện Ảnh</Link></li>
            <li><Link href="#">Phim Hay Tháng</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>HỖ TRỢ</h4>
          <ul>
            <li><Link href="#">Góp Ý</Link></li>
            <li><Link href="#">Sale & Services</Link></li>
            <li><Link href="#">Rạp / Giá Vé</Link></li>
            <li><Link href="#">Tuyển Dụng</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-brand">
          <h1>Social Network </h1>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          CÔNG TY CỔ PHẦN PHIM MAGICAN<br />
          HẬU DỊCH VỌNG, HÀ NỘI - 
          ĐT: 028.3933.3033 - 1900.2224 (8:00 - 22:00) - 
          Email: demo@magicanfilm.vn
        </p>
      </div>
    </footer>
  );
}
