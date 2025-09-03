import ArticleDetail from "@/components/ArticleDetail";

type Props = {
    params: {
      slug: string;
    };
  };
  
  export default function ArticleDetailPage({ params }: Props) {
    return <ArticleDetail slug={params.slug} />;
  }
  
