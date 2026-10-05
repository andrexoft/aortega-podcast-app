'use client';

import { useMemo, useState } from 'react';
import { PodcastGrid } from '@/components/PodcastGrid/PodcastGrid';
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
      <h1>Podcaster</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <p>Total de podcasts: {filteredPodcasts.length}</p>

      <PodcastGrid podcasts={filteredPodcasts} />
    </main>
  );
}