import { render, screen } from '@testing-library/react';

import type { Podcast } from '@/types/podcast';

import { PodcastGrid } from './PodcastGrid';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ''}
      data-priority={priority ? 'true' : 'false'}
    />
  ),
}));

const podcasts: Podcast[] = [
  {
    id: '1',
    title: 'First Podcast',
    author: 'First Author',
    image: 'https://example.com/first.jpg',
    description: 'First description',
  },
  {
    id: '2',
    title: 'Second Podcast',
    author: 'Second Author',
    image: 'https://example.com/second.jpg',
    description: 'Second description',
  },
  {
    id: '3',
    title: 'Third Podcast',
    author: 'Third Author',
    image: 'https://example.com/third.jpg',
    description: 'Third description',
  },
];

describe('PodcastGrid', () => {
  it('renderiza todos los podcasts', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    expect(
      screen.getByRole('heading', {
        name: 'First Podcast',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Second Podcast',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Third Podcast',
      }),
    ).toBeInTheDocument();
  });

  it('muestra el autor de cada podcast', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    expect(
      screen.getByText('Author: First Author'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Author: Second Author'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Author: Third Author'),
    ).toBeInTheDocument();
  });

  it('crea un enlace al detalle de cada podcast', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    expect(
      screen.getByRole('link', {
        name: 'Ver podcast First Podcast',
      }),
    ).toHaveAttribute('href', '/podcast/1');

    expect(
      screen.getByRole('link', {
        name: 'Ver podcast Second Podcast',
      }),
    ).toHaveAttribute('href', '/podcast/2');

    expect(
      screen.getByRole('link', {
        name: 'Ver podcast Third Podcast',
      }),
    ).toHaveAttribute('href', '/podcast/3');
  });

  it('prioriza únicamente la imagen del primer podcast', () => {
    render(<PodcastGrid podcasts={podcasts} />);

    const images = document.querySelectorAll(
      'img[data-priority]',
    );

    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute(
      'data-priority',
      'true',
    );

    expect(images[1]).toHaveAttribute(
      'data-priority',
      'false',
    );

    expect(images[2]).toHaveAttribute(
      'data-priority',
      'false',
    );
  });

  it('no renderiza podcasts cuando la lista está vacía', () => {
    render(<PodcastGrid podcasts={[]} />);

    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});