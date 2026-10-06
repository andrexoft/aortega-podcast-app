import {
  getCachedData,
  setCachedData,
} from './cache';

describe('cache', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('guarda y recupera datos correctamente', () => {
    const data = {
      id: '123',
      title: 'Test Podcast',
    };

    setCachedData('podcast', data);

    expect(getCachedData('podcast')).toEqual(data);
  });

  it('devuelve null cuando no existe la clave', () => {
    expect(getCachedData('missing-key')).toBeNull();
  });

  it('elimina y devuelve null cuando la caché ha expirado', () => {
    const data = {
      id: '123',
      title: 'Test Podcast',
    };

    setCachedData('podcast', data);

    const now = Date.now();

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(
        now + 24 * 60 * 60 * 1000 + 1,
      );

    expect(getCachedData('podcast')).toBeNull();
    expect(localStorage.getItem('podcast')).toBeNull();
  });

  it('devuelve los datos mientras la caché no haya expirado', () => {
    const data = {
      id: '123',
      title: 'Test Podcast',
    };

    setCachedData('podcast', data);

    const now = Date.now();

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(
        now + 24 * 60 * 60 * 1000 - 1,
      );

    expect(getCachedData('podcast')).toEqual(data);
  });

  it('sobrescribe una caché existente', () => {
    setCachedData('podcast', {
      id: '123',
      title: 'Podcast antiguo',
    });

    const newData = {
      id: '456',
      title: 'Podcast nuevo',
    };

    setCachedData('podcast', newData);

    expect(getCachedData('podcast')).toEqual(newData);
  });
});