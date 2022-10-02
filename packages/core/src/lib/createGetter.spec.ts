import { createGetter } from './createGetter';

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

const getStreetName = createGetter<Company>()(['address', 'street', 'name']);

describe('createGetter', () => {
  const company: Company = {
    id: 1,
    name: 'GrainUA',
    address: {
      street: {
        kind: 'st',
        name: 'Sadova',
      },
      building: '333',
      country: 'Ukraine',
      region: 'Cherkasy',
    },
  };

  it('should create a Getter for a nested property', () => {
    expect(getStreetName(company)).toBe('Sadova');
  });
});
