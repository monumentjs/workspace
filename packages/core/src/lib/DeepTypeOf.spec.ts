/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepTypeOf } from './DeepTypeOf';

type Sample = {
  a: {
    b?: {
      c: number;
      d?: {
        e: string;
        f?: boolean;
      };
    };
    g: string;
  };
  h: boolean;
  k: {
    m: {
      n: number;
    } | null;
  };
};

describe('DeepTypeOf', () => {
  it('should guarantee a nested value type-safety', () => {
    const a1: DeepTypeOf<Sample, ['a']> = {
      g: 'abc',
    };
    const a2: DeepTypeOf<Sample, ['a']> = {
      b: undefined,
      g: 'abc',
    };
    const a3: DeepTypeOf<Sample, ['a']> = {
      b: {
        c: 123,
      },
      g: 'abc',
    };
    const a4: DeepTypeOf<Sample, ['a']> = {
      b: {
        c: 123,
        d: undefined,
      },
      g: 'abc',
    };
    const a5: DeepTypeOf<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
        },
      },
      g: 'abc',
    };
    const a6: DeepTypeOf<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
          f: undefined,
        },
      },
      g: 'abc',
    };
    const a7: DeepTypeOf<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
          f: false,
        },
      },
      g: 'abc',
    };

    const ab1: DeepTypeOf<Sample, ['a', 'b']> = undefined;
    const ab2: DeepTypeOf<Sample, ['a', 'b']> = { c: 123 };
    const ab3: DeepTypeOf<Sample, ['a', 'b']> = { c: 123, d: undefined };
    const ab4: DeepTypeOf<Sample, ['a', 'b']> = { c: 123, d: { e: 'abc' } };
    const ab5: DeepTypeOf<Sample, ['a', 'b']> = {
      c: 123,
      d: { e: 'abc', f: undefined },
    };
    const ab6: DeepTypeOf<Sample, ['a', 'b']> = {
      c: 123,
      d: { e: 'abc', f: false },
    };
  });

  // const abc: DeepTypeOf<Sample, ['a', 'b', 'c']> = 123;

  // const abcd: DeepTypeOf<Sample, ['a', 'b', 'c', 'd']> = undefined;
});
