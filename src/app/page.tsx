'use client';

import { usePodcasts } from '@/hooks/usePodcasts';

export default function HomePage() {
  const { podcasts, isLoading } = usePodcasts();

  if (isLoading) {
    return <main>Cargando podcasts...</main>;
  }

  return (
    <main>
      <h1>Top Podcasts</h1>

      <p>Total de podcasts: {podcasts.length}</p>

      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            {podcast.title} — {podcast.author}
          </li>
        ))}
      </ul>
    </main>
  );
}
