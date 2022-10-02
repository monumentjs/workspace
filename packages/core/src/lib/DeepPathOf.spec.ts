import { DeepPathOf } from './DeepPathOf';

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

describe('DeepPathOf', () => {
  it('should guarantee a nested path type-safety', () => {
    <DeepPathOf<Sample>>['a'];
    <DeepPathOf<Sample>>['a', 'b'];
    // @ts-expect-error when path contains an optional property
    <DeepPathOf<Sample>>['a', 'b', 'c'];
    // @ts-expect-error when path contains an optional property
    <DeepPathOf<Sample>>['a', 'b', 'd'];
    // @ts-expect-error when path contains an optional property
    <DeepPathOf<Sample>>['a', 'b', 'd', 'e'];
    // @ts-expect-error when path contains an optional property
    <DeepPathOf<Sample>>['a', 'b', 'd', 'f'];
    <DeepPathOf<Sample>>['a', 'g'];
    <DeepPathOf<Sample>>['h'];
    <DeepPathOf<Sample>>['k'];
    <DeepPathOf<Sample>>['k', 'm'];
    // @ts-expect-error when path contains a nullable property
    <DeepPathOf<Sample>>['k', 'm', 'n'];
    // @ts-expect-error when path is not correct
    <DeepPathOf<Sample>>['l', 'o', 'l'];

    <DeepPathOf<Sample[]>>[0, 'a', 'b'];
  });
});
