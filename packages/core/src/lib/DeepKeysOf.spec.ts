import { DeepKeysOf } from './DeepKeysOf';

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

describe('DeepKeysOf', () => {
  it('should guarantee a nested path type-safety', () => {
    <DeepKeysOf<Sample>>['a'];
    <DeepKeysOf<Sample>>['a', 'b'];
    // @ts-expect-error when path contains an optional property
    <DeepKeysOf<Sample>>['a', 'b', 'c'];
    // @ts-expect-error when path contains an optional property
    <DeepKeysOf<Sample>>['a', 'b', 'd'];
    // @ts-expect-error when path contains an optional property
    <DeepKeysOf<Sample>>['a', 'b', 'd', 'e'];
    // @ts-expect-error when path contains an optional property
    <DeepKeysOf<Sample>>['a', 'b', 'd', 'f'];
    <DeepKeysOf<Sample>>['a', 'g'];
    <DeepKeysOf<Sample>>['h'];
    <DeepKeysOf<Sample>>['k'];
    <DeepKeysOf<Sample>>['k', 'm'];
    // @ts-expect-error when path contains a nullable property
    <DeepKeysOf<Sample>>['k', 'm', 'n'];
    // @ts-expect-error when path is not correct
    <DeepKeysOf<Sample>>['l', 'o', 'l'];

    <DeepKeysOf<Sample[]>>[0, 'a', 'b'];
  });
});
