import Link from 'next/link';

import type { Podcast } from '@/types/podcast';

import styles from './PodcastCard.module.css';

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <article className={styles.card}>
      <Link
        href={`/podcast/${podcast.id}`}
        className={styles.link}
        aria-label={`Ver podcast ${podcast.title}`}
      >
        <img
          src={podcast.image}
          alt=""
          className={styles.image}
        />

        <div className={styles.content}>
          <h2 className={styles.title}>{podcast.title}</h2>

          <p className={styles.author}>{podcast.author}</p>
        </div>
      </Link>
    </article>
  );
}