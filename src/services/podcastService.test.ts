import { getPodcastDetail, getTopPodcasts } from './podcastService';

describe('podcastService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTopPodcasts', () => {
    it('obtiene y transforma correctamente los podcasts', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [
                  { label: 'image-55.jpg' },
                  { label: 'image-60.jpg' },
                  { label: 'image-100.jpg' },
                ],
                summary: {
                  label: 'Podcast description',
                },
                link: {
                  attributes: {
                    href: 'https://example.com/podcast',
                  },
                },
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result).toEqual([
        {
          id: '123',
          title: 'Test Podcast',
          author: 'Test Author',
          image: 'image-100.jpg',
          description: 'Podcast description',
          podcastUrl: 'https://example.com/podcast',
        },
      ]);

      expect(mockFetch).toHaveBeenCalledTimes(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
      );
    });

    it('utiliza la primera imagen cuando no existe la imagen de mayor resolución', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image-55.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].image).toBe('image-55.jpg');
    });

    it('utiliza una descripción vacía cuando no existe summary', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].description).toBe('');
    });

    it('utiliza undefined cuando el podcast no tiene URL', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          feed: {
            entry: [
              {
                id: {
                  attributes: {
                    'im:id': '123',
                  },
                },
                'im:name': {
                  label: 'Test Podcast',
                },
                'im:artist': {
                  label: 'Test Author',
                },
                'im:image': [{ label: 'image.jpg' }],
              },
            ],
          },
        }),
      } as Response);

      const result = await getTopPodcasts();

      expect(result[0].podcastUrl).toBeUndefined();
    });

    it('lanza un error cuando la petición de podcasts falla', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getTopPodcasts()).rejects.toThrow(
        'Failed to fetch podcasts: 500',
      );
    });
  });

  describe('getPodcastDetail', () => {
    it('obtiene y transforma correctamente el detalle del podcast', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 123,
              collectionName: 'Test Podcast',
              artistName: 'Test Author',
              artworkUrl600: 'image-600.jpg',
              artworkUrl100: 'image-100.jpg',
              description: 'Podcast description',
              feedUrl: 'https://example.com/feed',
            },
            {
              kind: 'podcast-episode',
              collectionId: 123,
              trackId: 456,
              trackName: 'Episode 1',
              description: 'Episode description',
              releaseDate: '2026-01-15T10:00:00Z',
              trackTimeMillis: 125000,
              episodeUrl: 'https://example.com/episode.mp3',
            },
          ],
        }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result).toEqual({
        id: '123',
        title: 'Test Podcast',
        author: 'Test Author',
        image: 'image-600.jpg',
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

      expect(mockFetch).toHaveBeenCalledTimes(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://itunes.apple.com/lookup?id=123&media=podcast&entity=podcastEpisode&limit=20',
      );
    });

    it('convierte correctamente la duración de milisegundos a segundos', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 123,
              collectionName: 'Test Podcast',
              artistName: 'Test Author',
            },
            {
              kind: 'podcast-episode',
              trackId: 456,
              trackName: 'Episode 1',
              trackTimeMillis: 3665000,
            },
          ],
        }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.episodes[0].duration).toBe(3665);
    });

    it('utiliza artworkUrl100 cuando no existe artworkUrl600', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 123,
              collectionName: 'Test Podcast',
              artistName: 'Test Author',
              artworkUrl100: 'image-100.jpg',
            },
          ],
        }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.image).toBe('image-100.jpg');
    });

    it('utiliza valores vacíos cuando faltan datos opcionales', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 123,
            },
            {
              kind: 'podcast-episode',
              trackId: 456,
            },
          ],
        }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result).toEqual({
        id: '123',
        title: '',
        author: '',
        image: '',
        description: '',
        podcastUrl: undefined,
        episodes: [
          {
            id: '456',
            title: '',
            description: '',
            releaseDate: '',
            duration: 0,
            audioUrl: '',
          },
        ],
      });
    });

    it('ignora resultados que no sean episodios', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 123,
              collectionName: 'Test Podcast',
              artistName: 'Test Author',
            },
            {
              kind: 'podcast-episode',
              trackId: 456,
              trackName: 'Episode 1',
            },
            {
              kind: 'artist',
              trackId: 789,
              trackName: 'Something else',
            },
          ],
        }),
      } as Response);

      const result = await getPodcastDetail('123');

      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0].id).toBe('456');
    });

    it('lanza un error cuando la petición del detalle falla', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(getPodcastDetail('123')).rejects.toThrow(
        'Failed to fetch podcast detail: 404',
      );
    });

    it('lanza un error cuando el podcast no existe en la respuesta', async () => {
      const mockFetch = jest.mocked(global.fetch);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              kind: 'podcast',
              collectionId: 999,
              collectionName: 'Another Podcast',
              artistName: 'Another Author',
            },
          ],
        }),
      } as Response);

      await expect(getPodcastDetail('123')).rejects.toThrow(
        'Podcast not found: 123',
      );
    });
  });
});
