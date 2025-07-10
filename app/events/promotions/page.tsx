'use client';

import Image from 'next/image';
import '@/styles/components/promotions.scss';

const promotions = [
  {
    title: 'HUẾ – GIỮ XE MIỄN PHÍ TẠI BHD STAR',
    image: '/uudai1.jpg',
    desc: 'BHD Star – Huế hiện đang triển khai chương trình miễn phí giữ xe dành cho toàn bộ khách hàng đến rạp xem phim. Chi tiết chương trình: tại BHD Star Cineplex Huế. Thời gian áp dụng: Từ tháng 6/2025 đến khi có thông báo kết thúc.',
  },
  {
    title: 'U22 – GIÁ SIÊU NHẸ, TRẢI NGHIỆM SIÊU ĐỈNH',
    image: '/uudai2.jpg',
    desc: 'Mùa hè rực rỡ đã đến, BHD Star dành tặng U22 ưu đãi cực đã – giá vé xem phim chỉ từ 48K dành cho học sinh, sinh viên dưới 22 tuổi.',
  },
  {
    title: 'CINE SUMMER – ƯU ĐÃI XUẤT CHIẾU ĐÊM, CHỈ TỪ 50K',
    image: '/uudai3.jpg',
    desc: 'Bạn là cú đêm chính hiệu? CINE SUMMER – Ưu đãi xuất chiếu đêm sau 22h với giá chỉ từ 50K tại BHD Star.',
  },
];

export default function PromotionsPage() {
  return (
    <main className="promotions-page">
      <h1 className="title">ƯU ĐÃI ĐẶC BIỆT</h1>
      <div className="promo-grid">
        {promotions.map((promo, index) => (
          <div className="promo-card" key={index}>
            <Image src={promo.image} alt={promo.title} width={400} height={400} />
            <h2>{promo.title}</h2>
            <p>{promo.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
