import { set } from './set';

type Sample = {
  a: {
    b: {
      c: number;
      d: {
        e: string;
        f?: boolean;
      };
    };
    g: string;
  };
  h: string[];
};

describe('set', () => {
  it('should create a new whole with nested property set to a given value', () => {
    const original: Sample = {
      a: {
        b: {
          c: 123,
          d: { e: '123' },
        },
        g: 'abc',
      },
      h: ['a', 'b'],
    };

    const result: Sample = set(original, ['a', 'b', 'd', 'e'], 'def');

    expect(result).toEqual({
      a: {
        b: {
          c: 123,
          d: { e: 'def' },
        },
        g: 'abc',
      },
      h: ['a', 'b'],
    });
  });
});
