'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import '@/styles/components/food.scss';

type Food = {
  food_id: number;
  food_name: string;
  food_description: string;
  food_price: number;
  food_img?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Food[]>([]);

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch('http://localhost:3000/food', {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch foods');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('❌ Error fetching food:', err);
      }
    }

    fetchFoods();
  }, []);

  return (
    <main className="products-page">
      <h1 className="heading">Combo Ưu Đãi</h1>
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.food_id}>
            <Image
              src={p.food_img?.startsWith('/') ? p.food_img : `/${p.food_img}`}
              alt={p.food_name}
              width={380}
              height={300}
            />
            <h2>{p.food_name}</h2>
            <p className="desc">{p.food_description}</p>
            <div className="price">
              <span className="old">{p.food_price.toLocaleString()} VND</span>
              <span className="new">
                {(p.food_price * 0.85).toLocaleString()} VND
              </span>
            </div>
            {/* <button className="buy-button">MUA NGAY</button> */}
          </div>
        ))}
      </div>
    </main>
  );
}
