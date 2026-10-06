import { render, screen } from '@testing-library/react';

import type { Podcast } from '@/types/podcast';

import PodcastEpisodeDetail from './PodcastEpisodeDetail';

jest.mock('@/components/PodcastSidebar/PodcastSidebar', () => ({
  PodcastSidebar: ({
    podcast,
    showBackLink,
  }: {
    podcast: Podcast;
    showBackLink?: boolean;
  }) => (
    <aside>
      <h1>{podcast.title}</h1>
      <p>{podcast.author}</p>

      {showBackLink && (
        <a href={`/podcast/${podcast.id}`}>
          ← Volver al podcast
        </a>
      )}
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

const episode = {
  title: 'Test Episode',
  description:
    '<p>This is the episode description.</p>',
  audioUrl: 'https://example.com/episode.mp3',
};

describe('PodcastEpisodeDetail', () => {
  it('renderiza el título del episodio', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={episode}
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Test Episode',
      }),
    ).toBeInTheDocument();
  });

  it('renderiza la descripción HTML del episodio', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={episode}
      />,
    );

    expect(
      screen.getByText(
        'This is the episode description.',
      ),
    ).toBeInTheDocument();
  });

  it('convierte una URL escrita en texto en un enlace', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={{
          ...episode,
          description:
            'Visita https://example.com para más información.',
        }}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    expect(link).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('abre las URLs externas en una nueva pestaña', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={{
          ...episode,
          description:
            'Visita https://example.com para más información.',
        }}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'https://example.com',
    });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });

  it('mantiene los enlaces HTML existentes', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={{
          ...episode,
          description:
            '<p>Visita <a href="https://openai.com">OpenAI</a>.</p>',
        }}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'OpenAI',
    });

    expect(link).toHaveAttribute(
      'href',
      'https://openai.com',
    );
  });

  it('renderiza el reproductor de audio con la URL del episodio', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={episode}
      />,
    );

    const audio = document.querySelector('audio');

    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute(
      'src',
      'https://example.com/episode.mp3',
    );
    expect(audio).toHaveAttribute('controls');
  });

  it('muestra el enlace para volver al podcast', () => {
    render(
      <PodcastEpisodeDetail
        podcast={podcast}
        episode={episode}
      />,
    );

    expect(
      screen.getByRole('link', {
        name: '← Return to podcast',
      }),
    ).toHaveAttribute('href', '/podcast/123');
  });
});