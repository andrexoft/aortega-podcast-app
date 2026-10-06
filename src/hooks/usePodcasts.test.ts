import { renderHook, waitFor } from '@testing-library/react';

import { getTopPodcasts } from '@/services/podcastService';
import { getCachedData, setCachedData } from '@/lib/cache';
import { usePodcasts } from './usePodcasts';

jest.mock('@/services/podcastService', () => ({
  getTopPodcasts: jest.fn(),
}));

jest.mock('@/lib/cache', () => ({
  getCachedData: jest.fn(),
  setCachedData: jest.fn(),
}));

const mockGetTopPodcasts = jest.mocked(getTopPodcasts);
const mockGetCachedData = jest.mocked(getCachedData);
const mockSetCachedData = jest.mocked(setCachedData);

describe('usePodcasts', () => {
  const podcasts = [
    {
      id: '1',
      title: 'Podcast 1',
      author: 'Author 1',
      image: 'image-1.jpg',
      description: 'Description 1',
    },
    {
      id: '2',
      title: 'Podcast 2',
      author: 'Author 2',
      image: 'image-2.jpg',
      description: 'Description 2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('empieza en estado de carga', () => {
    mockGetCachedData.mockReturnValue(null);

    mockGetTopPodcasts.mockReturnValue(
      new Promise(() => {}),
    );

    const { result } = renderHook(() => usePodcasts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.podcasts).toEqual([]);
  });

  it('utiliza los podcasts almacenados en caché', async () => {
    mockGetCachedData.mockReturnValue(podcasts);

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual(podcasts);
    expect(mockGetCachedData).toHaveBeenCalledWith(
      'top-podcasts',
    );
    expect(mockGetTopPodcasts).not.toHaveBeenCalled();
    expect(mockSetCachedData).not.toHaveBeenCalled();
  });

  it('obtiene los podcasts del servicio cuando no existe caché', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetTopPodcasts.mockResolvedValue(podcasts);

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual(podcasts);
    expect(mockGetTopPodcasts).toHaveBeenCalledTimes(1);
  });

  it('guarda en caché los podcasts obtenidos del servicio', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetTopPodcasts.mockResolvedValue(podcasts);

    renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(mockSetCachedData).toHaveBeenCalledWith(
        'top-podcasts',
        podcasts,
      );
    });
  });

  it('finaliza la carga aunque el servicio falle', async () => {
    mockGetCachedData.mockReturnValue(null);
    mockGetTopPodcasts.mockRejectedValue(
      new Error('API error'),
    );

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual([]);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});