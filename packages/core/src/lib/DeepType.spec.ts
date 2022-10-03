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

describe('DeepType', () => {
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

  const abc: DeepType<Sample, ['a', 'b', 'c']> = 123;

  const abd1: DeepType<Sample, ['a', 'b', 'd']> = undefined;
  const abd2: DeepType<Sample, ['a', 'b', 'd']> = { e: 'abc' };
  const abd3: DeepType<Sample, ['a', 'b', 'd']> = { e: 'abc', f: undefined };
  const abd4: DeepType<Sample, ['a', 'b', 'd']> = { e: 'abc', f: true };

  const h: DeepType<Sample, ['h']> = true;

  const k: DeepType<Sample, ['k']> = { m: { n: 123 } };

  const km1: DeepType<Sample, ['k', 'm']> = null;
  const km2: DeepType<Sample, ['k', 'm']> = { n: 123 };

  const kmn: DeepType<Sample, ['k', 'm', 'n']> = 123;
});
