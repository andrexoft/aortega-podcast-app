import Image from 'next/image';
import Link from 'next/link';

import styles from './PodcastEpisodeDetail.module.css';

interface PodcastEpisodeDetailProps {
  podcast: {
    id: string;
    title: string;
    author: string;
    image: string;
  };
  episode: {
    title: string;
    description: string;
    audioUrl: string;
  };
}

export default function PodcastEpisodeDetail({
  podcast,
  episode,
}: PodcastEpisodeDetailProps) {
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

        <Link
          href={`/podcast/${podcast.id}`}
          className={styles.backLink}
        >
          ← Volver al podcast
        </Link>
      </aside>

      <main className={styles.content}>
        <h2 className={styles.episodeTitle}>{episode.title}</h2>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: episode.description,
          }}
        />

        <audio
          className={styles.audio}
          controls
          src={episode.audioUrl}
        />
      </main>
    </div>
  );
}