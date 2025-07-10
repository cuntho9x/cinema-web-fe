'use client';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/components/movieComming.scss';

const movies = [
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

export default function CommingMovies() {
  return (
    <section className="now-comming">
      <h2>Phim Sắp Chiếu</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <Link href={movie.link} key={index} className="movie-card">
            <div className="poster">
              <Image src={movie.image} alt={movie.title} width={240} height={360} />
              <span className="age">{movie.age}</span>
              <span className="rating">
                <i className="star">★</i> {movie.rating}
              </span>
            </div>
            <div className="title">{movie.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
