import Image from 'next/image';
import Link from 'next/link';

import styles from './PodcastSidebar.module.css';

interface PodcastSidebarProps {
  podcast: {
    id: string;
    title: string;
    author: string;
    image: string;
    description: string;
  };
  showBackLink?: boolean;
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('br').forEach((br) => {
    br.replaceWith('\n');
  });

  return doc.body.textContent?.trim() ?? '';
}

export function PodcastSidebar({
  podcast,
  showBackLink = false,
}: PodcastSidebarProps) {
  return (
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

        {showBackLink && (
          <Link
            href={`/podcast/${podcast.id}`}
            className={styles.backLink}
          >
            ← Volver al podcast
          </Link>
        )}
      </div>
    </aside>
  );
}