'use client';

import { useParams } from 'next/navigation';

import PodcastDetail from '@/components/PodcastDetail/PodcastDetail';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';

export default function PodcastDetailPage() {
  const params = useParams<{ id: string }>();
  const { podcast, isLoading } = usePodcastDetail(params.id);

  if (isLoading) {
    return <main>Cargando podcast...</main>;
  }

  if (!podcast) {
    return <main>Podcast no encontrado</main>;
  }

  return <PodcastDetail podcast={podcast} episodes={podcast.episodes} />;
}