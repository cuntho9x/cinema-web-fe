// components/MovieSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/components/movieSection.scss';

type Movie = {
  title: string;
  image: string;
  rating: number;
  age: string;
  link: string;
};

interface Props {
  title: string;
  movies: Movie[];
  linkMore?: string;
}

export default function MovieSection({ title, movies, linkMore }: Props) {
  const visibleMovies = movies.slice(0, 8);

  return (
    <section className="movie-section">
        <div className="movie-section-header">
            <h2>{title}</h2>
        </div>
        <div className="movie-grid">
            {visibleMovies.map((movie) => (
            <Link key={movie.link} href={movie.link} className="movie-card">
                <Image src={movie.image} alt={movie.title} width={220} height={320} />
                <p>{movie.title}</p>
            </Link>
            ))}
        </div>
        {linkMore && (
          <Link href={linkMore} className="see-more">Xem thêm →</Link>
        )}
        <div className='line-default'></div>
    </section>
  );
}
