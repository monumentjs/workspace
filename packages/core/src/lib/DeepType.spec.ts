/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepType } from './DeepType';

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
    const a1: DeepType<Sample, ['a']> = {
      g: 'abc',
    };
    const a2: DeepType<Sample, ['a']> = {
      b: undefined,
      g: 'abc',
    };
    const a3: DeepType<Sample, ['a']> = {
      b: {
        c: 123,
      },
      g: 'abc',
    };
    const a4: DeepType<Sample, ['a']> = {
      b: {
        c: 123,
        d: undefined,
      },
      g: 'abc',
    };
    const a5: DeepType<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
        },
      },
      g: 'abc',
    };
    const a6: DeepType<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
          f: undefined,
        },
      },
      g: 'abc',
    };
    const a7: DeepType<Sample, ['a']> = {
      b: {
        c: 123,
        d: {
          e: 'abc',
          f: false,
        },
      },
      g: 'abc',
    };

    const ab1: DeepType<Sample, ['a', 'b']> = undefined;
    const ab2: DeepType<Sample, ['a', 'b']> = { c: 123 };
    const ab3: DeepType<Sample, ['a', 'b']> = { c: 123, d: undefined };
    const ab4: DeepType<Sample, ['a', 'b']> = { c: 123, d: { e: 'abc' } };
    const ab5: DeepType<Sample, ['a', 'b']> = {
      c: 123,
      d: { e: 'abc', f: undefined },
    };
    const ab6: DeepType<Sample, ['a', 'b']> = {
      c: 123,
      d: { e: 'abc', f: false },
    };
  });

  // const abc: DeepTypeOf<Sample, ['a', 'b', 'c']> = 123;

  // const abcd: DeepTypeOf<Sample, ['a', 'b', 'c', 'd']> = undefined;
});
