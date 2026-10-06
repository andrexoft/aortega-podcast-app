import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renderiza el campo de búsqueda', () => {
    render(<SearchBar value="" onChange={jest.fn()} />);

    expect(
      screen.getByRole('searchbox', {
        name: 'Filter podcasts',
      }),
    ).toBeInTheDocument();
  });

  it('muestra el valor recibido', () => {
    render(<SearchBar value="spotify" onChange={jest.fn()} />);

    expect(
      screen.getByRole('searchbox', {
        name: 'Filter podcasts',
      }),
    ).toHaveValue('spotify');
  });

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<SearchBar value="" onChange={onChange} />);

    await user.type(
      screen.getByRole('searchbox', {
        name: 'Filter podcasts',
      }),
      'react',
    );

    expect(onChange).toHaveBeenCalledTimes(5);

    expect(onChange.mock.calls.map(([value]) => value)).toEqual([
      'r',
      'e',
      'a',
      'c',
      't',
    ]);
  });

  it('permite limpiar el campo de búsqueda', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<SearchBar value="react" onChange={onChange} />);

    const input = screen.getByRole('searchbox', {
      name: 'Filter podcasts',
    });

    await user.clear(input);

    expect(onChange).toHaveBeenCalledWith('');
  });
});
