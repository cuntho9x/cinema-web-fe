'use client';

import Image from 'next/image';
import '@/styles/components/products.scss';

const products = [
  {
    title: 'OL Combo Single Sweet 44Oz - Pepsi 22Oz',
    desc: '01 bắp lớn vị ngọt + 01 ly nước 22Oz. Nhận trong ngày xem phim.',
    image: '/combo1.png',
    priceOld: 85000,
    priceNew: 76500,
  },
  {
    title: 'OL Combo Couple Sweet 44Oz - Pepsi 22Oz',
    desc: '01 bắp lớn vị ngọt + 02 ly nước 22Oz. Nhận trong ngày xem phim.',
    image: '/combo1.png',
    priceOld: 115000,
    priceNew: 103500,
  },
  {
    title: 'OL Food CB Xúc Xích Sweet 44Oz - Pepsi 22Oz',
    desc: '01 bắp lớn vị ngọt + 01 ly nước 22Oz + 01 xúc xích lốc xoáy.',
    image: '/combo1.png',
    priceOld: 118000,
    priceNew: 106200,
  },
  {
    title: 'OL Food CB KTC Sweet 44Oz - Pepsi 22Oz',
    desc: '01 bắp lớn vị ngọt + 01 ly nước 22Oz + 01 khoai tây chiên.',
    image: '/combo1.png',
    priceOld: 118000,
    priceNew: 106200,
  },
 
];

export default function ProductsPage() {
  return (
    <main className="products-page">
      <h1 className="heading">Combo Ưu Đãi</h1>
      <div className="products-grid">
        {products.map((p, index) => (
          <div className="product-card" key={index}>
            <Image src={p.image} alt={p.title} width={380} height={300} />
            <h2>{p.title}</h2>
            <p className="desc">{p.desc}</p>
            <div className="price">
              <span className="old">{p.priceOld.toLocaleString()} VND</span>
              <span className="new">{p.priceNew.toLocaleString()} VND</span>
            </div>
            <button className="buy-button">MUA NGAY</button>
          </div>
        ))}
      </div>
    </main>
  );
}
