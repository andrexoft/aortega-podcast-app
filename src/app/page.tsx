'use client';

import { useMemo, useState } from 'react';
import { PodcastGrid } from '@/components/PodcastGrid/PodcastGrid';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { usePodcasts } from '@/hooks/usePodcasts';
import styles from './page.module.css';
import { Loading } from '@/components/Loading/Loading';

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
    return <Loading message="Cargando podcasts..." />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.toolbar}>
        <p className={styles.count}>{filteredPodcasts.length}</p>

        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <PodcastGrid podcasts={filteredPodcasts} />
    </main>
  );
}