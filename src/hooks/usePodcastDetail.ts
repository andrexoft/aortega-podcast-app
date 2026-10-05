'use client';

import { useEffect, useState } from 'react';

import { getPodcastDetail } from '@/services/podcastService';
import { getCachedData, setCachedData } from '@/lib/cache';
import type { PodcastDetail } from '@/types/podcast';

interface UsePodcastDetailResult {
  podcast: PodcastDetail | null;
  isLoading: boolean;
}

export function usePodcastDetail(
  podcastId: string,
): UsePodcastDetailResult {
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPodcastDetail() {
      try {
        const cacheKey = `podcast-detail-${podcastId}`;
        const cachedPodcast = getCachedData<PodcastDetail>(cacheKey);

        if (cachedPodcast) {
          setPodcast(cachedPodcast);
          return;
        }

        const fetchedPodcast = await getPodcastDetail(podcastId);

        setCachedData(cacheKey, fetchedPodcast);
        setPodcast(fetchedPodcast);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPodcastDetail();
  }, [podcastId]);

  return {
    podcast,
    isLoading,
  };
}
