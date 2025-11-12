'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ModalTrailer from '@/components/ModalTrailer';
import '@/styles/components/movieShowing.scss'; // Đổi CSS nếu cần

type Movie = {
  movie_id?: number;
  movie_title_url: string;
  movie_title: string;
  movie_poster: string;
  movie_trailer: string;
  rating?: number;
  age?: string;
  duration?: number;
  release_date?: string;
  movieGenres?: { genre: { name: string } }[];
};

export default function NowShowingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNowShowing() {
      try {
        const res = await fetch('http://localhost:3000/movie?status=nowShowing', {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch now showing movies');
        const data = await res.json();
        // Handle both object format { movies: [] } and array format
        if (data && typeof data === 'object' && 'movies' in data) {
          setMovies(Array.isArray(data.movies) ? data.movies : []);
        } else if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching nowShowing movies:', error);
        setMovies([]);
      }
    }

    fetchNowShowing();
  }, []);

  return (
    <section className="movie-showing">
      <div className="movie-section-header">
        <h2>Phim Đang Chiếu</h2>
      </div>
      <div className="movie-grid">
        {Array.isArray(movies) && movies.length > 0 ? movies.map((movie) => (
          <div key={movie.movie_title_url} className="movie-card">
            <Link href={`/movie/${movie.movie_title_url}`}>
              <div className="poster-wrapper">
                <Image
                  src={
                    movie.movie_poster.startsWith('/')
                      ? (movie.movie_poster.startsWith('/movie/') ? movie.movie_poster : `/movie${movie.movie_poster}`)
                      : `/movie/${movie.movie_poster}`
                  }
                  alt={movie.movie_title}
                  width={220}
                  height={320}
                />
                <span className="age">{movie.age || 'K'}</span>
                <span className="rating">★ {movie.rating || '9.0'}</span>

                <div className="hover-buttons">
                  <button
                    className="btn primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/movie/${movie.movie_title_url}`;
                    }}
                  >
                    🎟️ Đặt vé
                  </button>
                  <button
                    className="btn secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setTrailerUrl(
                        movie.movie_trailer.startsWith('/')
                          ? movie.movie_trailer
                          : `/${movie.movie_trailer}`
                      );
                    }}
                  >
                    ▶ Trailer
                  </button>
                </div>
              </div>
            </Link>

            <p className="movie-title">{movie.movie_title}</p>
            <div className="movie-meta">
              <span>
                <strong>Thể loại:</strong>{' '}
                {movie.movieGenres?.map((g) => g.genre.name).join(', ') || 'Đang cập nhật'}
              </span>
              <span>
                <strong>Thời lượng:</strong> {movie.duration || '???'} phút
              </span>
              <span>
                <strong>Khởi chiếu:</strong>{' '}
                {movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : '???'}
              </span>
            </div>
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Không có phim đang chiếu nào.
          </div>
        )}
      </div>

      {trailerUrl && (
        <ModalTrailer url={trailerUrl} onClose={() => setTrailerUrl(null)} />
      )}
    </section>
  );
}
