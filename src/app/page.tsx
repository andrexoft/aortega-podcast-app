'use client';

import { useMemo, useState } from 'react';
import { PodcastCard } from '@/components/PodcastCard/PodcastCard';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { usePodcasts } from '@/hooks/usePodcasts';

export default function HomePage() {
  const { podcasts, isLoading } = usePodcasts();
  const [search, setSearch] = useState('');

  const filteredPodcasts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return podcasts;
    }

    return podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(normalizedSearch) ||
        podcast.author.toLowerCase().includes(normalizedSearch),
    );
  }, [podcasts, search]);

  if (isLoading) {
    return <main>Cargando podcasts...</main>;
  }

  return (
    <main>
      <h1>Top Podcasts</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <p>Total de podcasts: {filteredPodcasts.length}</p>

      <div>
        {filteredPodcasts.map((podcast, index) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            priority={index === 0}
          />
        ))}
      </div>
    </main>
  );
}
