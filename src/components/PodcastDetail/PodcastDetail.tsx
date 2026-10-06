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

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('br').forEach((br) => {
    br.replaceWith('\n');
  });

  return doc.body.textContent?.trim() ?? '';
}

export default function PodcastDetail({
  podcast,
  episodes,
}: PodcastDetailProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link
          href={`/podcast/${podcast.id}`}
          className={styles.imageLink}
        >
          <Image
            className={styles.image}
            src={podcast.image}
            alt={podcast.title}
            width={300}
            height={300}
          />
        </Link>

        <div className={styles.sidebarContent}>
          <h1 className={styles.title}>{podcast.title}</h1>

          <p className={styles.author}>
            by {podcast.author}
          </p>



          <div className={styles.description}>
            <p className={styles.descriptionTitle}>
                Description:
            </p>
            {stripHtml(podcast.description)}
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>
          Episodes: {episodes.length}
        </h2>

        <div className={styles.episodes}>
          <div className={styles.episodesHeader}>
            <span>Title</span>
            <span>Date</span>
            <span>Duration</span>
          </div>

          {episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/podcast/${podcast.id}/episode/${episode.id}`}
              className={styles.episode}
            >
              <span className={styles.episodeTitle}>
                {episode.title}
              </span>

              <span className={styles.episodeDate}>
                {formatDate(episode.releaseDate)}
              </span>

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
