import BannerSlider from '@/components/BannerSlider';
import MovieSection from '@/components/movieSection';
import ReviewSection from '@/components/ReviewSection';
import Image from 'next/image';

async function getMoviesByStatus(status: string) {
  try {
    // Lấy nhiều phim hơn cho trang home (limit=50 để hiển thị đủ)
    const res = await fetch(`http://localhost:3000/movie?status=${status}&limit=50`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch ${status} movies`);
      return [];
    }

    const data = await res.json();
    
    // Xử lý cả hai format: object với movies hoặc array trực tiếp
    if (data && typeof data === 'object' && 'movies' in data) {
      // Format mới với pagination
      return Array.isArray(data.movies) ? data.movies : [];
    } else if (Array.isArray(data)) {
      // Format cũ - array trực tiếp (fallback)
      return data;
    }
    
    return [];
  } catch (error) {
    console.error(`❌ Error fetching ${status} movies:`, error);
    return [];
  }
}

export default async function Home() {
  const nowShowing = await getMoviesByStatus('nowShowing');
  const comingSoon = await getMoviesByStatus('comingSoon');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <BannerSlider />

      {Array.isArray(nowShowing) && nowShowing.length > 0 && (
        <MovieSection
          title="Phim Đang Chiếu"
          movies={nowShowing.map((movie: any) => ({
            title: movie.movie_title,
            image: movie.movie_poster && movie.movie_poster.startsWith('/')
              ? (movie.movie_poster.startsWith('/movie/') ? movie.movie_poster : `/movie${movie.movie_poster}`)
              : movie.movie_poster ? `/movie/${movie.movie_poster}` : '/placeholder-poster.jpg',
            rating: movie.movie_review || '9.0',
            age: movie.age_restriction || 'P',
            link: `/movie/${movie.slug || movie.movie_title_url}`,
            trailerUrl: movie.movie_trailer || '',
          }))}
        />
      )}

      {Array.isArray(comingSoon) && comingSoon.length > 0 && (
        <MovieSection
          title="Phim Sắp Chiếu"
          movies={comingSoon.map((movie: any) => ({
            title: movie.movie_title,
            image: movie.movie_poster && movie.movie_poster.startsWith('/')
              ? (movie.movie_poster.startsWith('/movie/') ? movie.movie_poster : `/movie${movie.movie_poster}`)
              : movie.movie_poster ? `/movie/${movie.movie_poster}` : '/placeholder-poster.jpg',
            rating: movie.movie_review || '9.0',
            age: movie.age_restriction || 'P',
            link: `/movie/${movie.slug || movie.movie_title_url}`,
            trailerUrl: movie.movie_trailer || '',
          }))}
        />
      )}

      <ReviewSection />

      <div className="w-full">
        <Image
          src="/catalog/qr.png"
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
