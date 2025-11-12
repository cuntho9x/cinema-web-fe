import MovieDetail from "@/components/MovieDetail";

interface PageProps {
  params: { slug: string };
}

export default async function MovieDetailPage(props: PageProps) {
  const params = await props.params;
  return <MovieDetail slug={params.slug} />;
}

