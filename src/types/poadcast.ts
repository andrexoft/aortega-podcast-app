export interface Podcast {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  podcastUrl?: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  audioUrl: string;
}

export interface PodcastDetail extends Podcast {
  episodes: Episode[];
}
