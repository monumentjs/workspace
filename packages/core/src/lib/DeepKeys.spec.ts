import { DeepKeys } from './DeepKeys';

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

describe('DeepKeys', () => {
  it('should guarantee a nested path type-safety', () => {
    <DeepKeys<Sample>>['a'];
    <DeepKeys<Sample>>['a', 'b'];
    // @ts-expect-error when path contains an optional property
    <DeepKeys<Sample>>['a', 'b', 'c'];
    // @ts-expect-error when path contains an optional property
    <DeepKeys<Sample>>['a', 'b', 'd'];
    // @ts-expect-error when path contains an optional property
    <DeepKeys<Sample>>['a', 'b', 'd', 'e'];
    // @ts-expect-error when path contains an optional property
    <DeepKeys<Sample>>['a', 'b', 'd', 'f'];
    <DeepKeys<Sample>>['a', 'g'];
    <DeepKeys<Sample>>['h'];
    <DeepKeys<Sample>>['k'];
    <DeepKeys<Sample>>['k', 'm'];
    // @ts-expect-error when path contains a nullable property
    <DeepKeys<Sample>>['k', 'm', 'n'];
    // @ts-expect-error when path is not correct
    <DeepKeys<Sample>>['l', 'o', 'l'];

    <DeepKeys<Sample[]>>[0, 'a', 'b'];
  });
});
