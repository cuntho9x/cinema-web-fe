import MovieDetail from "@/components/MovieDetail";

interface PageProps {
  params: { slug: string };
}

export default async function MovieDetailPage({ params }: PageProps) {
  return <MovieDetail slug={params.slug} />;
}
