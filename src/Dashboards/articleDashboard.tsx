import { useState, useEffect } from 'react';
import type { Article } from '../service/arcticlesService';

type Props = {
  authorId: string;
};

export default function ArticleDashboard({ authorId }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/authors/${authorId}/articles`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: Article[]) => setArticles(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authorId]); // re-fetch whenever a different author is clicked

  if (loading) return <p>Loading articles…</p>;
  if (error) return <p>Error: {error}</p>;
  if (articles.length === 0) return <p>This author has no articles.</p>;

  return (
    <ul className='grid gap-3'>
      {articles.map((article) => (
        <li key={article.id} className='border rounded-sm p-4'>
          <h2 className='text-xl font-bold'>{article.title}</h2>
          <p>{article.content}</p>
        </li>
      ))}
    </ul>
  );
}
