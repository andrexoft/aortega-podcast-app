import { render, screen } from '@testing-library/react';

import type { Podcast } from '@/types/podcast';

import PodcastDetail from './PodcastDetail';

jest.mock('@/components/PodcastSidebar/PodcastSidebar', () => ({
  PodcastSidebar: ({
    podcast,
  }: {
    podcast: Podcast;
  }) => (
    <aside>
      <h1>{podcast.title}</h1>
      <p>{podcast.author}</p>
    </aside>
  ),
}));

const podcast: Podcast = {
  id: '123',
  title: 'Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/podcast.jpg',
  description: 'Test description',
};

const episodes = [
  {
    id: 'episode-1',
    title: 'First Episode',
    releaseDate: '2024-01-15T10:00:00Z',
    duration: 125,
  },
  {
    id: 'episode-2',
    title: 'Second Episode',
    releaseDate: '2024-02-20T10:00:00Z',
    duration: 3661,
  },
  {
    id: 'episode-3',
    title: 'Third Episode',
    releaseDate: '2024-03-25T10:00:00Z',
    duration: 65,
  },
];

describe('PodcastDetail', () => {
  it('renderiza la información del podcast', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Test Podcast',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Test Author'),
    ).toBeInTheDocument();
  });

  it('muestra el número total de episodios', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Episodes: 3',
      }),
    ).toBeInTheDocument();
  });

  it('renderiza todos los episodios', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(
      screen.getByText('First Episode'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Second Episode'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Third Episode'),
    ).toBeInTheDocument();
  });

  it('formatea correctamente las fechas de los episodios', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(
      screen.getByText('15/01/2024'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('20/02/2024'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('25/03/2024'),
    ).toBeInTheDocument();
  });

  it('formatea correctamente las duraciones', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(screen.getByText('2:05')).toBeInTheDocument();
    expect(screen.getByText('1:01:01')).toBeInTheDocument();
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });

  it('crea el enlace correcto para cada episodio', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={episodes}
      />,
    );

    expect(
      screen.getByRole('link', {
        name: /First Episode/,
      }),
    ).toHaveAttribute(
      'href',
      '/podcast/123/episode/episode-1',
    );

    expect(
      screen.getByRole('link', {
        name: /Second Episode/,
      }),
    ).toHaveAttribute(
      'href',
      '/podcast/123/episode/episode-2',
    );

    expect(
      screen.getByRole('link', {
        name: /Third Episode/,
      }),
    ).toHaveAttribute(
      'href',
      '/podcast/123/episode/episode-3',
    );
  });

  it('muestra cero episodios cuando la lista está vacía', () => {
    render(
      <PodcastDetail
        podcast={podcast}
        episodes={[]}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Episodes: 0',
      }),
    ).toBeInTheDocument();
  });
});