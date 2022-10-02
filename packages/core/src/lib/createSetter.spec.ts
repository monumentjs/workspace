import { createSetter } from './createSetter';

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

const setStreetName = createSetter<Company>()(['address', 'street', 'name']);

describe('createSetter', () => {
  it('should set a nested value', () => {
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

    const result: Company = setStreetName(company)('Udy');

    expect(result).toEqual({
      id: 1,
      name: 'GrainUA',
      address: {
        street: {
          kind: 'st',
          name: 'Udy',
        },
        building: '333',
        country: 'Ukraine',
        region: 'Cherkasy',
      },
    });
  });

  it('should be type-safe', () => {
    createSetter<Company>()(['id']);
    createSetter<Company>()(['name']);
    createSetter<Company>()(['description']);
    createSetter<Company>()(['address']);
    createSetter<Company>()(['address', 'street']);
    createSetter<Company>()(['address', 'street', 'name']);
    createSetter<Company>()(['address', 'street', 'kind']);
    createSetter<Company>()(['address', 'country']);
    createSetter<Company>()(['address', 'region']);
    createSetter<Company>()(['address', 'building']);

    // @ts-expect-error when unknown key is used
    createSetter<Company>()(['address', 'continent']);

    // @ts-expect-error when unknown key is used
    createSetter<Company>()(['address', 'street', 'type']);

    // @ts-expect-error when unknown key is used
    createSetter<Company>()(['address', 'street', 'name', 'length']);
  });
});
