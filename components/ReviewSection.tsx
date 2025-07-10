'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import '@/styles/components/reviewSection.scss';

const reviews = [
  {
    title: "[Review] 28 Years Later: Thế Giới Hậu Tận Thế Tàn Khốc",
    image: "/elio.jpg",
    likes: 526,
    views: 526,
    link: "/reviews/28-years-later"
  },
  {
    title: "[Review] How To Train Your Dragon: Live Action Hoàn Hảo Của Bí Kíp Luyện Rồng?",
    image: "/elio.jpg",
    likes: 718,
    views: 718,
    link: "/reviews/how-to-train-your-dragon"
  },
  {
    title: "[Review] Hi Five: Hài Hước, Vô Tri Nhưng Cũng Rất Sâu Sắc",
    image: "/elio.jpg",
    likes: 595,
    views: 595,
    link: "/reviews/hi-five"
  },
  {
    title: "[Review] Bring Her Back: Bi Kịch Từ Tình Mẫu Tử Độc Hại",
    image: "/elio.jpg",
    likes: 184,
    views: 184,
    link: "/reviews/bring-her-back"
  }
];

const reviewArticles = [
  {
    title: 'Final Destination Bloodlines: Hé Lộ Bí Mật Về Vòng Lặp Tử Thần',
    image: '/elio.jpg',
    likes: 85,
    views: 85
  },
  {
    title: 'Bùi Thạc Chuyên Và 11 Năm Tâm Huyết Với Địa Đạo: Mặt Trời Trong Bóng Tối',
    image: '/elio.jpg',
    likes: 123,
    views: 123
  },
  {
    title: 'Tổng Hợp Oscar 2025: Anora Thắng Lớn',
    image: '/f1.jpg',
    likes: 35,
    views: 35
  },
  {
    title: 'Nụ Hôn Bạc Tỷ: Thúy Kiều - Thúy Vân Phiên Bản 2025?',
    image: '/ut-lan8.jpg',
    likes: 123,
    views: 123
  }
];

export default function ReviewSection() {
  const [activeTab, setActiveTab] = useState<'review' | 'blog'>('review');

  const handleTabClick = (tab: 'review' | 'blog') => {
    setActiveTab(tab);
  };

  return (
    <section className="review-section">
      <h2>Góc Điện Ảnh</h2>

      <div className="tabs">
        <span
          className={activeTab === 'review' ? 'active' : ''}
          onClick={() => handleTabClick('review')}
        >
          Bình luận phim
        </span>
        <span
          className={activeTab === 'blog' ? 'active' : ''}
          onClick={() => handleTabClick('blog')}
        >
          Blog điện ảnh
        </span>
      </div>

      {activeTab === 'review' ? (
        <div className="content-grid">
          <div className="main-review">
            <Link href={reviews[0].link}>
              <Image
                src={reviews[0].image}
                alt={reviews[0].title}
                width={800}
                height={450}
              />
              <h3>{reviews[0].title}</h3>
            </Link>
            <div className="actions">
              <button>👍 Thích</button>
              <span>👁 {reviews[0].views}</span>
            </div>
          </div>

          <div className="side-reviews">
            {reviews.slice(1).map((item, index) => (
              <Link href={item.link} key={index} className="item">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={80}
                />
                <div className="info">
                  <h4>{item.title}</h4>
                  <div className="actions">
                    <button>👍 Thích</button>
                    <span>👁 {item.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="content-grid">
          <div className="main-review">
            <Image
              src={reviewArticles[0].image}
              alt={reviewArticles[0].title}
              width={800}
              height={450}
            />
            <h3>{reviewArticles[0].title}</h3>
            <div className="actions">
              <button>👍 Thích</button>
              <span>👁 {reviewArticles[0].views}</span>
            </div>
          </div>

          <div className="side-reviews">
            {reviewArticles.slice(1).map((item, index) => (
              <div key={index} className="item">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={80}
                />
                <div className="info">
                  <h4>{item.title}</h4>
                  <div className="actions">
                    <button>👍 Thích</button>
                    <span>👁 {item.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="more-button">
        <button>Xem thêm →</button>
      </div>

      <div className='line-default'></div>
    </section>
  );
}
