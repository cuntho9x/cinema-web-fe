'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '@/styles/components/reviewSection.scss';

interface Article {
  article_id: number;
  article_title: string;
  article_thumbnail: string;
  article_slug: string;
  article_type: 'review' | 'blog';
  // Bỏ qua content/image vì chưa cần
}

export default function ReviewSection() {
  const [activeTab, setActiveTab] = useState<'review' | 'blog'>('review');
  const [articles, setArticles] = useState<Article[]>([]);

  const handleTabClick = (tab: 'review' | 'blog') => setActiveTab(tab);

  useEffect(() => {
    fetch('http://localhost:3000/article/')
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Lỗi khi fetch articles:', err));
  }, []);

  const filteredArticles = articles.filter((a) => a.article_type === activeTab);

  return (
    <section className="review-section">
      <h2>Góc Điện Ảnh</h2>

      <div className="tabs">
        <span className={activeTab === 'review' ? 'active' : ''} onClick={() => handleTabClick('review')}>
          Bình luận phim
        </span>
        <span className={activeTab === 'blog' ? 'active' : ''} onClick={() => handleTabClick('blog')}>
          Blog điện ảnh
        </span>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="content-grid">
          <div className="main-review">
            <Link href={`/article/${filteredArticles[0].article_slug}`}>
            {filteredArticles[0].article_thumbnail && (
              <Image
                src={filteredArticles[0].article_thumbnail.startsWith('/')
                  ? filteredArticles[0].article_thumbnail
                  : `/${filteredArticles[0].article_thumbnail}`}
                alt={filteredArticles[0].article_title}
                width={800}
                height={450}
              />
            )}

              <h3>{filteredArticles[0].article_title}</h3>
            </Link>
            <div className="actions">
              <button>👍 Thích</button>
              <span>👁 123</span>
            </div>
          </div>

          <div className="side-reviews">
            {filteredArticles.slice(1).map((article) => (
              <Link
                href={`/article/${article.article_slug}`}
                key={article.article_id}
                className="item"
              >
               {article.article_thumbnail && (
                  <Image
                    src={
                      article.article_thumbnail.startsWith('/')
                        ? article.article_thumbnail
                        : `/${article.article_thumbnail}`
                    }
                    alt={article.article_title}
                    width={120}
                    height={80}
                  />
                )}

                <div className="info">
                  <h4>{article.article_title}</h4>
                  <div className="actions">
                    <button>👍 Thích</button>
                    <span>👁 123</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>Không có bài viết nào</p>
      )}

      <div className="more-button">
        <button>Xem thêm →</button>
      </div>

      <div className="line-default"></div>
    </section>
  );
}
