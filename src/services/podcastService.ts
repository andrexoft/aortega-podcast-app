import type { Podcast } from '@/types/podcast';

const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

interface ApplePodcastResponse {
  feed: {
    entry: Array<{
      id: {
        attributes: {
          'im:id': string;
        };
      };
      'im:name': {
        label: string;
      };
      'im:artist': {
        label: string;
      };
      'im:image': Array<{
        label: string;
      }>;
      summary?: {
        label: string;
      };
      link?: {
        attributes?: {
          href?: string;
        };
      };
    }>;
  };
}

export async function getTopPodcasts(): Promise<Podcast[]> {
  const response = await fetch(TOP_PODCASTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch podcasts: ${response.status}`);
  }

  const data: ApplePodcastResponse = await response.json();

  return data.feed.entry.map((podcast) => ({
    id: podcast.id.attributes['im:id'],
    title: podcast['im:name'].label,
    author: podcast['im:artist'].label,
    image: podcast['im:image'][2]?.label ?? podcast['im:image'][0].label,
    description: podcast.summary?.label ?? '',
    podcastUrl: podcast.link?.attributes?.href,
  }));
}
