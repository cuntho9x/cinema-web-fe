"use client";

import { useState } from "react";
import '@/styles/components/theaterPage.scss';
import Image from 'next/image';
import Slider from "react-slick";

const days = [
  { label: "Hôm Nay", date: "02/07" },
  { label: "Thứ Năm", date: "03/07" },
  { label: "Thứ Sáu", date: "04/07" },
  { label: "Thứ Bảy", date: "05/07" },
  { label: "Chủ Nhật", date: "06/07" },
];

const movies = [
  {
    id: 1,
    title: "Bí Kíp Luyện Rồng",
    image: "/movie/bi-kip-luyen-rong.jpg",
    rating: 9.5,
    date: "02/07",
    age: "K",
  },
  {
    id: 2,
    title: "M3GAN 2.0",
    image: "/movie/bi-kip-luyen-rong.jpg",
    rating: 9.4,
    date: "03/07",
    age: "T16",
  },
  // ... thêm các phim khác nếu cần
];

const theaters = ["Galaxy Nguyễn Du", "Galaxy Mipec", "Galaxy Quang Trung"];

export default function TheaterPage() {
  const [selectedDate, setSelectedDate] = useState("02/07");
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]);

  const filteredMovies = movies.filter((movie) => movie.date === selectedDate);

  const bannerImages = [
    "/banner/theaterBanner1.jpg",
    "/banner/theaterBanner2.jpg",
    "/banner/theaterBanner3.jpg",
    "/banner/theaterBanner4.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="bg-grey">
      <div className="banner-slider">
        <Slider {...settings}>
          {bannerImages.map((img, i) => (
            <Image key={i} src={img} alt="banner" width={1600} height={600} />
          ))}
        </Slider>
      </div>

      <div className="theater-page">
        <div className="theater-select">
          <label>Chọn Rạp:</label>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
          >
            {theaters.map((theater, index) => (
              <option key={index} value={theater}>
                {theater}
              </option>
            ))}
          </select>
        </div>

        {/* <h2 className="section-title">PHIM</h2>
        <div className="date-tabs">
          {days.map((day) => (
            <button
              key={day.date}
              className={`tab-button ${selectedDate === day.date ? "active" : ""}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <strong>{day.label}</strong>
              <br />
              {day.date}
            </button>
          ))}
        </div>

        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <div className="movie-poster">
                <img src={movie.image} alt={movie.title} />
                <div className="movie-badge">
                  <span className="rating">⭐ {movie.rating}</span>
                  <span className="age">{movie.age}</span>
                </div>
              </div>
              <p className="movie-title">{movie.title}</p>
            </div>
          ))}
        </div> */}
      </div>

      <div className="theater-info">
        <div className="ticket-pricing">
          <img src="/catalog/banggiave.jpg" alt="Bảng giá vé" />
        </div>
        <div className="theater-details">
          <h2>THÔNG TIN CHI TIẾT</h2>
          <p>
            <strong>Địa chỉ:</strong> Tầng 6, TTTM Mipec Long Biên, Số 2, Phố Long Biên 2, Ngọc Lâm, Long Biên, Hà Nội<br />
            <strong>Số điện thoại:</strong> 1900 2224
          </p>
          <div className="map">
            <iframe
              src="https://www.google.com/maps?q=Galaxy+Cinema+Mipec+Long+Biên&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              title="Magician Long Biên Map"
            />
          </div>
          <div className="theater-description">
            <p>
              Đến với <strong>Magician Cinema</strong>, khán giả sẽ được thưởng thức các siêu phẩm...
            </p>
            <p>
              Có thiết kế trẻ trung, dịch vụ thân thiện, Magician Cinema mong muốn sẽ là địa điểm tụ họp lý tưởng...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
