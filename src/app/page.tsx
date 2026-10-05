'use client';

import { PodcastCard } from '@/components/PodcastCard/PodcastCard';
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

      <div>
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
          />
        ))}
      </div>
    </main>
  );
}
