import BannerSlider from '@/components/BannerSlider';
import MovieSection from '@/components/movieSection';
import ReviewSection from '@/components/ReviewSection';
import Image from 'next/image';

async function getMoviesByStatus(status: string) {
  try {
    const res = await fetch(`http://localhost:3000/movie?status=${status}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch ${status} movies`);
      return [];
    }

    return await res.json();
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

      <MovieSection
        title="Phim Đang Chiếu"
        movies={nowShowing.map((movie: any) => ({
          title: movie.movie_title,
          image: movie.movie_poster.startsWith('/')
            ? movie.movie_poster
            : `/${movie.movie_poster}`,
            rating: movie.movie_review || '9.0',
            age: movie.age_restriction || 'P',
          link: `/movie/${movie.slug || movie.movie_title_url}`,
          trailerUrl: movie.movie_trailer ||'',
        }))}
      />

      <MovieSection
        title="Phim Sắp Chiếu"
        movies={comingSoon.map((movie: any) => ({
          title: movie.movie_title,
          image: movie.movie_poster.startsWith('/')
            ? movie.movie_poster
            : `/${movie.movie_poster}`,
          rating: movie.movie_review || '9.0',
          age: movie.age_restriction || 'P',
          link: `/movie/${movie.slug || movie.movie_title_url}`,
          trailerUrl: movie.movie_trailer || '',
        }))}
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
