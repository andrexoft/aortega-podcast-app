import { PodcastSidebar } from '@/components/PodcastSidebar/PodcastSidebar';

import styles from './PodcastEpisodeDetail.module.css';

interface PodcastEpisodeDetailProps {
  podcast: {
    id: string;
    title: string;
    author: string;
    image: string;
    description: string;
  };
  episode: {
    title: string;
    description: string;
    audioUrl: string;
  };
}

function formatEpisodeDescription(description: string): string {
  const container = document.createElement('div');

  container.innerHTML = description;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
  );

  const textNodes: Text[] = [];

  let node = walker.nextNode();

  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  const urlRegex = /https?:\/\/[^\s<]+/g;

  textNodes.forEach((textNode) => {
    const text = textNode.textContent ?? '';

    if (!urlRegex.test(text)) {
      return;
    }

    urlRegex.lastIndex = 0;

    const fragment = document.createDocumentFragment();

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = urlRegex.exec(text)) !== null) {
      const url = match[0];
      const start = match.index;

      if (start > lastIndex) {
        fragment.append(
          document.createTextNode(
            text.slice(lastIndex, start),
          ),
        );
      }

      const link = document.createElement('a');

      link.href = url;
      link.textContent = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      fragment.append(link);

      lastIndex = start + url.length;
    }

    if (lastIndex < text.length) {
      fragment.append(
        document.createTextNode(text.slice(lastIndex)),
      );
    }

    textNode.replaceWith(fragment);
  });

  return container.innerHTML.replace(
    /(&nbsp;|\u00a0)+/g,
    ' ',
  );
}

export default function PodcastEpisodeDetail({
  podcast,
  episode,
}: PodcastEpisodeDetailProps) {
  return (
    <div className={styles.container}>
      <PodcastSidebar
        podcast={podcast}
        showBackLink
      />

      <main className={styles.content}>
        <h2 className={styles.episodeTitle}>
          {episode.title}
        </h2>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: formatEpisodeDescription(
              episode.description,
            ),
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