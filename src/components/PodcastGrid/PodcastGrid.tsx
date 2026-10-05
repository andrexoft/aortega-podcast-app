import type { Podcast } from '@/types/podcast';

import { PodcastCard } from '@/components/PodcastCard/PodcastCard';

import styles from './PodcastGrid.module.css';

interface PodcastGridProps {
  podcasts: Podcast[];
}

export function PodcastGrid({ podcasts }: PodcastGridProps) {
  return (
    <div className={styles.grid}>
      {podcasts.map((podcast, index) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          priority={index === 0}
        />
      ))}
    </div>
  );
}