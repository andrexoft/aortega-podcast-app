import Image from 'next/image';
import Link from 'next/link';
import type { Podcast } from '@/types/podcast';
import styles from './PodcastCard.module.css';

interface PodcastCardProps {
  podcast: Podcast;
  priority?: boolean;
}

export function PodcastCard({ podcast, priority = false }: PodcastCardProps) {
  return (
    <article className={styles.card}>
      <Link
        href={`/podcast/${podcast.id}`}
        className={styles.link}
        aria-label={`Ver podcast ${podcast.title}`}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={podcast.image}
            alt=""
            width={180}
            height={180}
            className={styles.image}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{podcast.title}</h2>
          <p className={styles.author}>Author: {podcast.author}</p>
        </div>
      </Link>
    </article>
  );
}
