import { Func } from './Func';

export function compose<T0, R>(
  ...operators: readonly [Func<[value: T0], R>]
): Func<[value: T0], R>;

export function compose<T0, T1, R>(
  ...operators: readonly [Func<[value: T1], R>, Func<[value: T0], T1>]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, R>(
  ...operators: readonly [
    Func<[value: T2], R>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, R>(
  ...operators: readonly [
    Func<[value: T3], R>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, R>(
  ...operators: readonly [
    Func<[value: T4], R>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, T5, R>(
  ...operators: readonly [
    Func<[value: T5], R>,
    Func<[value: T4], T5>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, T5, T6, R>(
  ...operators: readonly [
    Func<[value: T6], R>,
    Func<[value: T5], T6>,
    Func<[value: T4], T5>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, T5, T6, T7, R>(
  ...operators: readonly [
    Func<[value: T7], R>,
    Func<[value: T6], T7>,
    Func<[value: T5], T6>,
    Func<[value: T4], T5>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, R>(
  ...operators: readonly [
    Func<[value: T8], R>,
    Func<[value: T7], T8>,
    Func<[value: T6], T7>,
    Func<[value: T5], T6>,
    Func<[value: T4], T5>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

export function compose<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  ...operators: readonly [
    Func<[value: T9], R>,
    Func<[value: T8], T9>,
    Func<[value: T7], T8>,
    Func<[value: T6], T7>,
    Func<[value: T5], T6>,
    Func<[value: T4], T5>,
    Func<[value: T3], T4>,
    Func<[value: T2], T3>,
    Func<[value: T1], T2>,
    Func<[value: T0], T1>
  ]
): Func<[value: T0], R>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose(...operators: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (input: any) {
    return operators.reduceRight((value, operator) => {
      return operator(value);
    }, input);
  };
}
