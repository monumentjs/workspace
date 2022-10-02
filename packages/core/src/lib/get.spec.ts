import { get } from './get';

interface Company {
  id: number;
  name: string;
  description?: string;
  address: Address;
}

interface Address {
  country: string;
  region: string;
  street?: Street;
  building?: string;
}

interface Street {
  name: string;
  kind: string;
}

describe('get', () => {
  it('should get a value of the nested property', () => {
    const company: Company = {
      id: 1,
      name: 'Demo',
      address: {
        country: 'Ukraine',
        region: 'Donetsk',
        street: {
          kind: 'st',
          name: 'Vynogradna',
        },
        building: '1a',
      },
    };

    expect(get(company, ['id'])).toBe(1);
    expect(get(company, ['name'])).toBe('Demo');
    expect(get(company, ['description'])).toBeUndefined();
    expect(get(company, ['address'])).toEqual({
      country: 'Ukraine',
      region: 'Donetsk',
      street: {
        kind: 'st',
        name: 'Vynogradna',
      },
      building: '1a',
    });
    expect(get(company, ['address', 'country'])).toBe('Ukraine');
    expect(get(company, ['address', 'region'])).toBe('Donetsk');
    expect(get(company, ['address', 'street'])).toEqual({
      kind: 'st',
      name: 'Vynogradna',
    });
    // @ts-expect-error when path includes an optional property
    expect(get(company, ['address', 'street', 'kind'])).toBe('st');
    // @ts-expect-error when path includes an optional property
    expect(get(company, ['address', 'street', 'name'])).toBe('Vynogradna');
    expect(get(company, ['address', 'building'])).toBe('1a');
  });

  it('should get an item of an array', () => {
    expect(get([{ message: 'hello' }], [0, 'message'])).toBe('hello');
  });
});
