'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import "@/styles/components/ArticleDetail.scss";

interface Article {
  article_title: string;
  article_slug: string;
  article_thumbnail: string;
  article_type: string;
  article_content1: string;
  article_image1: string;
  article_content2: string;
  article_image2: string;
  article_content3: string;
}

interface Props {
  slug: string;
}

const ArticleDetail = ({ slug }: Props) => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/article/${slug}`);
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    };

    fetchArticle();
  }, [slug]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{article.article_title}</h1>

      <Image
        src={article.article_thumbnail.startsWith("/") 
          ? (article.article_thumbnail.startsWith("/article/") ? article.article_thumbnail : `/article${article.article_thumbnail}`)
          : `/article/${article.article_thumbnail}`}
        alt="Thumbnail"
        width={800}
        height={400}
        style={{ marginBottom: '20px' }}
      />

      <p>{article.article_content1}</p>

      <Image
        src={article.article_image1.startsWith("/") 
          ? (article.article_image1.startsWith("/article/") ? article.article_image1 : `/article${article.article_image1}`)
          : `/article/${article.article_image1}`}
        alt="Image 1"
        width={800}
        height={400}
        style={{ marginBottom: '20px' }}
      />

      <p>{article.article_content2}</p>

      <Image
        src={article.article_image2.startsWith("/") 
          ? (article.article_image2.startsWith("/article/") ? article.article_image2 : `/article${article.article_image2}`)
          : `/article/${article.article_image2}`}
        alt="Image 2"
        width={800}
        height={400}
        style={{ marginBottom: '20px' }}
      />

      <p>{article.article_content3}</p>
    </div>
  );
};

export default ArticleDetail;
