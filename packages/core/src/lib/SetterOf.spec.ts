/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetterOf } from './SetterOf';

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
};

describe('SetterOf', () => {
  it('should declare a Setter for a given type and path', () => {
    let setA: SetterOf<Sample, ['a']>;
    let set_a_b: SetterOf<Sample, ['a', 'b']>;
    // @ts-expect-error when path contains a nullable property
    let set_a_b_c: SetterOf<Sample, ['a', 'b', 'c']>;
    // @ts-expect-error when path contains a nullable property
    let set_a_b_d: SetterOf<Sample, ['a', 'b', 'd']>;
    // @ts-expect-error when path contains a nullable property
    let set_a_b_d_e: SetterOf<Sample, ['a', 'b', 'd', 'e']>;
    // @ts-expect-error when path contains a nullable property
    let set_a_b_d_f: SetterOf<Sample, ['a', 'b', 'd', 'f']>;
    let set_a_g: SetterOf<Sample, ['a', 'g']>;
    let set_h: SetterOf<Sample, ['h']>;
  });
});
