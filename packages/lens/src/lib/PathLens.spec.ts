import { pipe } from '@monument/core';
import { PathLens } from './PathLens';

interface Company {
  id: number;
  name: string;
  description?: string;
  address: Address;
}

interface Address {
  country: string;
  region: string;
  street: Street;
  building: string;
}

interface Street {
  name: string;
  kind: string;
}

const add = (b: number) => (a: number) => a + b;
const toLowerCase = (source: string) => source.toLowerCase();

describe('PathLens', () => {
  const [getId, setId, overId] = PathLens<Company>()('id');
  const [getCountry, setCountry, overCountry] = PathLens<Company>()(
    'address',
    'country'
  );
  const [getStreetName, setStreetName, overStreetName] = PathLens<Company>()(
    'address',
    'street',
    'name'
  );

  const company: Company = {
    id: 1,
    name: 'Test',
    address: {
      country: 'Ukraine',
      region: 'Donetsk',
      street: {
        name: 'Sadova',
        kind: 'st',
      },
      building: '1a',
    },
  };

  describe('get', () => {
    it('should return a nested property value', () => {
      expect(getId(company)).toBe(1);
      expect(getCountry(company)).toBe('Ukraine');
      expect(getStreetName(company)).toBe('Sadova');
    });
  });

  describe('set', () => {
    it('should create a copy with a nested property set to the given value', () => {
      expect(
        pipe(
          setId(123),
          setCountry('Україна'),
          setStreetName('Садова')
        )(company)
      ).toEqual({
        id: 123,
        name: 'Test',
        address: {
          country: 'Україна',
          region: 'Donetsk',
          street: {
            name: 'Садова',
            kind: 'st',
          },
          building: '1a',
        },
      });
    });
  });

  describe('over', () => {
    it('should apply a map function for the value', () => {
      expect(
        pipe(
          overId(add(1)),
          overCountry(toLowerCase),
          overStreetName(toLowerCase)
        )(company)
      ).toEqual({
        id: 2,
        name: 'Test',
        address: {
          country: 'ukraine',
          region: 'Donetsk',
          street: {
            name: 'sadova',
            kind: 'st',
          },
          building: '1a',
        },
      });
    });
  });
});
