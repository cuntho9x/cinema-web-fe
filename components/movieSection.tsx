'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ModalTrailer from './ModalTrailer';
import '@/styles/components/movieSection.scss';

type Movie = {
  title: string;
  image: string;
  rating: number;
  age: string;
  link: string;
  trailerUrl: string;
};

interface Props {
  title: string;
  movies: Movie[];
}

export default function MovieSection({ title, movies }: Props) {
  const visibleMovies = movies.slice(0, 10);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  return (
    <section className="movie-section">
      <div className="movie-section-header">
        <h2>{title}</h2>
      </div>
      <div className="movie-grid">
        {visibleMovies.map((movie) => (
          <div key={movie.link} className="movie-card">
            <Link href={movie.link}>
              <div className="poster-wrapper">
                <Image
                  src={movie.image}
                  alt={movie.title}
                  width={220}
                  height={320}
                />

                <span className="age">{movie.age}</span>
                <span className="rating">⭐ {movie.rating}</span>

                <div className="hover-buttons">
                  <button
                    className="btn primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = movie.link;
                    }}
                  >
                    🎟️ Mua vé
                  </button>
                  <button
                    className="btn secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setTrailerUrl(movie.trailerUrl);
                    }}
                  >
                    ▶ Trailer
                  </button>
                </div>
              </div>
            </Link>
            <p className="movie-title">{movie.title}</p>
          </div>
        ))}
      </div>

      {title === 'Phim Đang Chiếu' && (
        <Link href="/movie/movieShowing" className="see-more">
          Xem thêm →
        </Link>
      )}
      {title === 'Phim Sắp Chiếu' && (
        <Link href="/movie/movieComming" className="see-more">
          Xem thêm →
        </Link>
      )}

      <div className="line-default"></div>

      {/* Modal Trailer */}
      {trailerUrl && (
        <ModalTrailer url={trailerUrl} onClose={() => setTrailerUrl(null)} />
      )}
    </section>
  );
}
