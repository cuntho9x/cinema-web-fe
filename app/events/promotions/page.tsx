'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import '@/styles/components/promotions.scss';

type Promotion = {
  promotions_id: number;
  promotions_name: string;
  promotions_img: string;
  promotions_description: string;
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3000/promotion');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <main className="promotions-page">
      <h1 className="title">ƯU ĐÃI ĐẶC BIỆT</h1>

      <div className="promo-grid">
        {promotions.map((promo) => (
          <div
            key={promo.promotions_id}
            className="promo-card"
            onClick={() => setSelectedPromo(promo)}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={
                promo.promotions_img.startsWith('/')
                  ? promo.promotions_img
                  : '/' + promo.promotions_img
              }
              alt={promo.promotions_name}
              width={400}
              height={400}
            />
            <h2>{promo.promotions_name}</h2>
            <p>
              {promo.promotions_description.length > 100
                ? promo.promotions_description.slice(0, 100) + '...'
                : promo.promotions_description}
            </p>
          </div>
        ))}
      </div>

      {selectedPromo && (
        <div className="modal-overlay" onClick={() => setSelectedPromo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPromo(null)}>
              ✖
            </button>
            <Image
              src={
                selectedPromo.promotions_img.startsWith('/')
                  ? selectedPromo.promotions_img
                  : '/' + selectedPromo.promotions_img
              }
              alt={selectedPromo.promotions_name}
              width={600}
              height={350}
            />
            <h2>{selectedPromo.promotions_name}</h2>
            <p>{selectedPromo.promotions_description}</p>
          </div>
        </div>
      )}
    </main>
  );
}
