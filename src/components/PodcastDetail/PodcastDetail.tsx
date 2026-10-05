import Image from 'next/image';
import Link from 'next/link';

import styles from './PodcastDetail.module.css';

interface PodcastDetailProps {
  podcast: {
    id: string;
    title: string;
    author: string;
    image: string;
    description: string;
  };
  episodes: {
    id: string;
    title: string;
    releaseDate: string;
    duration: number;
  }[];
}

function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PodcastDetail({
  podcast,
  episodes,
}: PodcastDetailProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link href={`/podcast/${podcast.id}`}>
          <Image
            className={styles.image}
            src={podcast.image}
            alt={podcast.title}
            width={300}
            height={300}
          />
        </Link>

        <h1 className={styles.title}>{podcast.title}</h1>

        <p className={styles.author}>{podcast.author}</p>

        <p className={styles.description}>{podcast.description}</p>
      </aside>

      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>

        <div className={styles.episodes}>
          {episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/podcast/${podcast.id}/episode/${episode.id}`}
              className={styles.episode}
            >
              <div className={styles.episodeInfo}>
                <h3 className={styles.episodeTitle}>{episode.title}</h3>

                <span className={styles.episodeDate}>
                  {episode.releaseDate}
                </span>
              </div>

              <span className={styles.episodeDuration}>
                {formatDuration(episode.duration)}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}