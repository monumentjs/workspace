import { Func } from '../Func';
import { Monad } from './Monad';

export interface Validated<E, V> extends Iterable<V>, Monad<V> {
  readonly isValid: boolean;
  readonly isInvalid: boolean;

  value(): V | undefined;
  value(fallback: Func<[errors: readonly E[]], V>): V;

  errors(): readonly E[];

  map<T>(project: Func<[value: V], T>): Validated<E, T>;

  flatMap<T>(project: Func<[value: V], Validated<E, T>>): Validated<E, T>;
  catchMap<F>(
    handle: Func<[errors: readonly E[]], Validated<F, V>>
  ): Validated<F, V>;

  forEach(fn: Func<[value: V], unknown>): Validated<E, V>;

  apply<T>(fn: Validated<E, Func<[V], T>>): Validated<E, T>;
  applyTo<T>(
    other: Validated<E, T>
  ): V extends Func<[T], unknown> ? Validated<E, ReturnType<V>> : never;

  fold<T>(
    onValid: Func<[value: V], T>,
    onInvalid: Func<[errors: readonly E[]], T>
  ): T;
}

class Valid_<E, V> implements Validated<E, V> {
  get isValid() {
    return true;
  }

  get isInvalid() {
    return false;
  }

  constructor(private readonly _value: V) {}

  *[Symbol.iterator]() {
    yield this._value;
  }

  value(): V | undefined;
  value(fallback: Func<[errors: readonly E[]], V>): V;
  value(): V | undefined {
    return this._value;
  }

  errors(): readonly E[] {
    return [];
  }

  map<T>(project: Func<[value: V], T>): Validated<E, T> {
    return new Valid_(project(this._value));
  }

  flatMap<T>(project: Func<[value: V], Validated<E, T>>): Validated<E, T> {
    return project(this._value);
  }

  catchMap<F>(): Validated<F, V> {
    return this as never;
  }

  forEach(fn: Func<[value: V], unknown>): Validated<E, V> {
    fn(this._value);

    return this;
  }

  apply<T>(func: Validated<E, Func<[value: V], T>>): Validated<E, T> {
    return func.map((fn) => fn(this._value));
  }

  applyTo<T>(
    value: Validated<E, T>
  ): V extends Func<[value: T], unknown> ? Validated<E, ReturnType<V>> : never {
    return value.apply(this as never) as never;
  }

  fold<T>(onValid: Func<[value: V], T>): T {
    return onValid(this._value);
  }
}

class Invalid_<E, V> implements Validated<E, V> {
  get isValid() {
    return false;
  }

  get isInvalid() {
    return true;
  }

  constructor(private readonly _errors: readonly E[]) {}

  *[Symbol.iterator]() {
    // yield nothing
  }

  value(): V | undefined;
  value(fallback: Func<[errors: readonly E[]], V>): V;
  value(fallback?: Func<[errors: readonly E[]], V>): V | undefined {
    return fallback?.(this._errors);
  }

  errors(): readonly E[] {
    return this._errors;
  }

  map<T>(): Validated<E, T> {
    return this as never;
  }

  flatMap<T>(): Validated<E, T> {
    return this as never;
  }

  catchMap<F>(
    handle: Func<[errors: readonly E[]], Validated<F, V>>
  ): Validated<F, V> {
    return handle(this._errors);
  }

  forEach(): Validated<E, V> {
    return this;
  }

  apply<T>(other: Validated<E, Func<[value: V], T>>): Validated<E, T> {
    return other.isInvalid
      ? new Invalid_([...this._errors, ...other.errors()])
      : (this as never);
  }

  applyTo<T>(
    other: Validated<E, T>
  ): V extends Func<[value: T], unknown> ? Validated<E, ReturnType<V>> : never {
    return other.apply(this as never) as never;
  }

  fold<T>(
    onValid: Func<[value: V], T>,
    onInvalid: Func<[errors: readonly E[]], T>
  ): T {
    return onInvalid(this._errors);
  }
}

export function Valid<E, V>(value: V): Validated<E, V> {
  return new Valid_(value);
}

export function Invalid<E, V>(errors: readonly E[]): Validated<E, V> {
  return new Invalid_(errors);
}

type ValidatedValues<Args extends readonly Validated<unknown, unknown>[]> = {
  readonly [K in keyof Args]: Args[K] extends Validated<unknown, infer V>
    ? V
    : never;
};

type ValidatedErrors<Args extends readonly Validated<unknown, unknown>[]> =
  Args extends readonly Validated<infer E, unknown>[] ? E : never;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Validated {
  export function all<
    Args extends readonly Validated<unknown, readonly unknown[]>[]
  >(...args: Args): Validated<ValidatedValues<Args>, ValidatedErrors<Args>> {
    const values: unknown[] = [];
    const errors: unknown[] = [];

    for (const arg of args) {
      if (arg.isValid) {
        values.push(...arg);
      }

      if (arg.isInvalid) {
        errors.push(arg.errors);
      }
    }

    if (errors.length) {
      return Invalid(errors as never);
    }

    return Valid(values as never);
  }
}
