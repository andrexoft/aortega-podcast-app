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

export default function PodcastDetail({
  podcast,
  episodes,
}: PodcastDetailProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Link href={`/podcast/${podcast.id}`}>
          <Image
            src={podcast.image}
            alt={podcast.title}
            width={300}
            height={300}
          />
        </Link>

        <h1>{podcast.title}</h1>

        <p>{podcast.author}</p>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: podcast.description }}
        />
      </aside>

      <main className={styles.content}>
        <h2>Episodes: {episodes.length}</h2>

        <div className={styles.episodes}>
          {episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/podcast/${podcast.id}/episode/${episode.id}`}
              className={styles.episode}
            >
              <div>
                <h3>{episode.title}</h3>
                <span>{episode.releaseDate}</span>
              </div>

              <span>{episode.duration}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
