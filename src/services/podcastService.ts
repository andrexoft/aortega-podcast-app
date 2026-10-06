import type { Episode, Podcast, PodcastDetail } from '@/types/podcast';

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

const PODCAST_DETAIL_URL =
  'https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20';

interface ApplePodcastDetailResponse {
  results: Array<{
    kind?: string;
    collectionId?: number;
    collectionName?: string;
    artistName?: string;
    artworkUrl600?: string;
    artworkUrl100?: string;
    description?: string;
    feedUrl?: string;
    trackId?: number;
    trackName?: string;
    releaseDate?: string;
    trackTimeMillis?: number;
    episodeUrl?: string;
  }>;
}

export async function getPodcastDetail(
  podcastId: string,
): Promise<PodcastDetail> {
  const response = await fetch(PODCAST_DETAIL_URL.replace('{id}', podcastId));

  if (!response.ok) {
    throw new Error(`Failed to fetch podcast detail: ${response.status}`);
  }

  const data: ApplePodcastDetailResponse = await response.json();

  const podcastResult = data.results.find(
    (result) => result.collectionId?.toString() === podcastId,
  );

  if (!podcastResult) {
    throw new Error(`Podcast not found: ${podcastId}`);
  }

  const episodes: Episode[] = data.results
    .filter((result) => result.kind === 'podcast-episode')
    .map((episode) => ({
      id: episode.trackId?.toString() ?? '',
      title: episode.trackName ?? '',
      description: episode.description ?? '',
      releaseDate: episode.releaseDate ?? '',
      duration: Math.floor((episode.trackTimeMillis ?? 0) / 1000),
      audioUrl: episode.episodeUrl ?? '',
    }));

  return {
    id: podcastId,
    title: podcastResult.collectionName ?? '',
    author: podcastResult.artistName ?? '',
    image: podcastResult.artworkUrl600 ?? podcastResult.artworkUrl100 ?? '',
    description: podcastResult.description ?? '',
    podcastUrl: podcastResult.feedUrl,
    episodes,
  };
}
