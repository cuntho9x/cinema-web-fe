import BannerSlider from '@/components/BannerSlider';
import MovieSection from '@/components/movieSection';
import ReviewSection from '@/components/ReviewSection';
import Image from 'next/image';

const nowShowing = [
  {
    title: "28 Năm Sau Tận Thế",
    image: "/ut-lan8.jpg",
    rating: 7.2,
    age: "T18",
    link: "/movies/28-nam-sau"
  },
  {
    title: "28 Năm Sau Tận Thế",
    image: "/ut-lan8.jpg",
    rating: 7.2,
    age: "T18",
    link: "/movies/28-nam-sau"
  },
   {
    title: "28 Năm Sau Tận Thế",
    image: "/ut-lan8.jpg",
    rating: 7.2,
    age: "T18",
    link: "/movies/28-nam-sau"
  },
   {
    title: "28 Năm Sau Tận Thế",
    image: "/ut-lan8.jpg",
    rating: 7.2,
    age: "T18",
    link: "/movies/28-nam-sau"
  },

];


const comingSoon = [
  {
    title: '28 Năm Sau Tận Thế',
    image: '/ut-lan8.jpg',
    rating: 7.2,
    age: 'T18',
    link: '/movies/28-nam-sau',
  },
  {
    title: 'Bí Kíp Luyện Rồng',
    image: '/elio.jpg',
    rating: 9.5,
    age: 'K',
    link: '/movies/bklr',
  },
  {
    title: 'Bí Kíp Luyện Rồng',
    image: '/elio.jpg',
    rating: 9.5,
    age: 'K',
    link: '/movies/bklr',
  },
  {
    title: 'Bí Kíp Luyện Rồng',
    image: '/elio.jpg',
    rating: 9.5,
    age: 'K',
    link: '/movies/bklr',
  },
   {
    title: '28 Năm Sau Tận Thế',
    image: '/ut-lan8.jpg',
    rating: 7.2,
    age: 'T18',
    link: '/movies/28-nam-sau',
  },
  {
    title: 'Bí Kíp Luyện Rồng',
    image: '/elio.jpg',
    rating: 9.5,
    age: 'K',
    link: '/movies/bklr',
  },
   {
    title: '28 Năm Sau Tận Thế',
    image: '/ut-lan8.jpg',
    rating: 7.2,
    age: 'T18',
    link: '/movies/28-nam-sau',
  },
  {
    title: 'Bí Kíp Luyện Rồng',
    image: '/elio.jpg',
    rating: 9.5,
    age: 'K',
    link: '/movies/bklr',
  },
];
export default function Home() {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <BannerSlider />
      <MovieSection
        title="Phim Đang Chiếu"
        movies={nowShowing}
        linkMore="/movie/movieShowing"
      />

      <MovieSection
        title="Phim Sắp Chiếu"
        movies={comingSoon}
        linkMore="/movie/movieComming"
      />

      <ReviewSection />

     <div className="w-full">
        <Image
          src="/qr.png"
          alt="qr"
          width={1920}
          height={600}
          layout="responsive"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
