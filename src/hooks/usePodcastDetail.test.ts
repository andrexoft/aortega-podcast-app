import { renderHook, waitFor } from '@testing-library/react';

import { getCachedData, setCachedData } from '@/lib/cache';
import { getPodcastDetail } from '@/services/podcastService';

import { usePodcastDetail } from './usePodcastDetail';

jest.mock('@/services/podcastService', () => ({
  getPodcastDetail: jest.fn(),
}));

jest.mock('@/lib/cache', () => ({
  getCachedData: jest.fn(),
  setCachedData: jest.fn(),
}));

const mockGetPodcastDetail = jest.mocked(getPodcastDetail);
const mockGetCachedData = jest.mocked(getCachedData);
const mockSetCachedData = jest.mocked(setCachedData);

describe('usePodcastDetail', () => {
  const podcastDetail = {
    id: '123',
    title: 'Test Podcast',
    author: 'Test Author',
    image: 'image.jpg',
    description: 'Podcast description',
    podcastUrl: 'https://example.com/feed',
    episodes: [
      {
        id: '456',
        title: 'Episode 1',
        description: 'Episode description',
        releaseDate: '2026-01-15T10:00:00Z',
        duration: 125,
        audioUrl: 'https://example.com/episode.mp3',
      },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('empieza en estado de carga', () => {
    mockGetCachedData.mockReturnValue(null);

    mockGetPodcastDetail.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.podcast).toBeNull();
  });

  it('utiliza el detalle almacenado en caché', async () => {
    mockGetCachedData.mockReturnValue(podcastDetail);

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcast).toEqual(podcastDetail);

    expect(mockGetCachedData).toHaveBeenCalledWith('podcast-detail-123');

    expect(mockGetPodcastDetail).not.toHaveBeenCalled();
    expect(mockSetCachedData).not.toHaveBeenCalled();
  });

  it('obtiene el detalle del servicio cuando no existe caché', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetPodcastDetail.mockResolvedValue(podcastDetail);

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcast).toEqual(podcastDetail);

    expect(mockGetCachedData).toHaveBeenCalledWith('podcast-detail-123');

    expect(mockGetPodcastDetail).toHaveBeenCalledWith('123');
  });

  it('guarda en caché el detalle obtenido del servicio', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetPodcastDetail.mockResolvedValue(podcastDetail);

    renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(mockSetCachedData).toHaveBeenCalledWith(
        'podcast-detail-123',
        podcastDetail,
      );
    });
  });

  it('mantiene todos los datos del detalle obtenido', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetPodcastDetail.mockResolvedValue(podcastDetail);

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcast).toEqual({
      id: '123',
      title: 'Test Podcast',
      author: 'Test Author',
      image: 'image.jpg',
      description: 'Podcast description',
      podcastUrl: 'https://example.com/feed',
      episodes: [
        {
          id: '456',
          title: 'Episode 1',
          description: 'Episode description',
          releaseDate: '2026-01-15T10:00:00Z',
          duration: 125,
          audioUrl: 'https://example.com/episode.mp3',
        },
      ],
    });
  });

  it('no realiza una nueva petición cuando existe caché', async () => {
    mockGetCachedData.mockReturnValue(podcastDetail);

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetPodcastDetail).not.toHaveBeenCalled();
  });

  it('finaliza la carga aunque el servicio falle', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetPodcastDetail.mockRejectedValue(new Error('API error'));

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcast).toBeNull();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
