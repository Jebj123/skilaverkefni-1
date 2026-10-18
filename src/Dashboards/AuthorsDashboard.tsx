import React, {useState, useEffect } from 'react';
import type { Author } from '../service/authorsService';
import ArticleDashboard from './articleDashboard';



export default function AuthorsDashboard(){
    const [authors, setAuthors] = useState<Author[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);



useEffect(() => {
    fetch('/api/authors')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: Author[]) => setAuthors(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); 

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

return(
    <div className='max-w-6xl mx-auto p-6 pt-30'>
        <h1 className='text-5xl flex m-h-screen items-center justify-center pb-10 underline pb-20 '>Authors</h1>
        <ul className='grid grid-cols-4 gap-3'>
            {authors.map((author) =>(
                <li key={author.id} className='grid grid-cols-1 border rounded-sm p-4 transition-transform hover:scale-102 hover:bg-blue-400' onClick={() => setSelectedAuthorId(author.id)} >
                    <strong>{author.name}</strong> ({author.email})
                    {author.bio && <p>{author.bio}</p>}
                </li>
            ))}
        </ul>
        {selectedAuthorId && (
          <div className='mt-10 pt-20'>
            <h2 className='text-3xl mb-4 underline'>Articles</h2>
            <ArticleDashboard authorId={selectedAuthorId} />
          </div>
        )}
    </div>
)


}