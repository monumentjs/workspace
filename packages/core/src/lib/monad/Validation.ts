import { Func } from '../Func';
import { Monad } from './Monad';

export interface Validation<E, V> extends Iterable<V>, Monad<V> {
  readonly isValid: boolean;
  readonly isInvalid: boolean;

  value(): V | undefined;
  value(fallback: Func<[errors: readonly E[]], V>): V;

  errors(): readonly E[];

  map<T>(project: Func<[value: V], T>): Validation<E, T>;

  flatMap<T>(project: Func<[value: V], Validation<E, T>>): Validation<E, T>;
  catchMap<F>(
    handle: Func<[errors: readonly E[]], Validation<F, V>>
  ): Validation<F, V>;

  forEach(fn: Func<[value: V], unknown>): Validation<E, V>;

  apply<T>(fn: Validation<E, Func<[V], T>>): Validation<E, T>;
  applyTo<T>(
    other: Validation<E, T>
  ): V extends Func<[T], unknown> ? Validation<E, ReturnType<V>> : never;

  fold<T>(
    onValid: Func<[value: V], T>,
    onInvalid: Func<[errors: readonly E[]], T>
  ): T;
}

class Valid_<E, V> implements Validation<E, V> {
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

  map<T>(project: Func<[value: V], T>): Validation<E, T> {
    return new Valid_(project(this._value));
  }

  flatMap<T>(project: Func<[value: V], Validation<E, T>>): Validation<E, T> {
    return project(this._value);
  }

  catchMap<F>(): Validation<F, V> {
    return this as never;
  }

  forEach(fn: Func<[value: V], unknown>): Validation<E, V> {
    fn(this._value);

    return this;
  }

  apply<T>(func: Validation<E, Func<[value: V], T>>): Validation<E, T> {
    return func.map((fn) => fn(this._value));
  }

  applyTo<T>(
    value: Validation<E, T>
  ): V extends Func<[value: T], unknown>
    ? Validation<E, ReturnType<V>>
    : never {
    return value.apply(this as never) as never;
  }

  fold<T>(onValid: Func<[value: V], T>): T {
    return onValid(this._value);
  }
}

class Invalid_<E, V> implements Validation<E, V> {
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

  map<T>(): Validation<E, T> {
    return this as never;
  }

  flatMap<T>(): Validation<E, T> {
    return this as never;
  }

  catchMap<F>(
    handle: Func<[errors: readonly E[]], Validation<F, V>>
  ): Validation<F, V> {
    return handle(this._errors);
  }

  forEach(): Validation<E, V> {
    return this;
  }

  apply<T>(other: Validation<E, Func<[value: V], T>>): Validation<E, T> {
    return other.isInvalid
      ? new Invalid_([...this._errors, ...other.errors()])
      : (this as never);
  }

  applyTo<T>(
    other: Validation<E, T>
  ): V extends Func<[value: T], unknown>
    ? Validation<E, ReturnType<V>>
    : never {
    return other.apply(this as never) as never;
  }

  fold<T>(
    onValid: Func<[value: V], T>,
    onInvalid: Func<[errors: readonly E[]], T>
  ): T {
    return onInvalid(this._errors);
  }
}

export function Valid<E, V>(value: V): Validation<E, V> {
  return new Valid_(value);
}

export function Invalid<E, V>(errors: readonly E[]): Validation<E, V> {
  return new Invalid_(errors);
}

type JointError<Input extends readonly Validation<unknown, unknown>[]> =
  Input extends readonly Validation<infer E, unknown>[] ? E : never;

type JointValue<Input extends readonly Validation<unknown, unknown>[]> = {
  [K in keyof Input]: Input[K] extends Validation<unknown, infer V> ? V : never;
};

type JointValidation<Input extends readonly Validation<unknown, unknown>[]> =
  Validation<JointError<Input>, JointValue<Input>>;

export function joinValidations<
  Input extends readonly Validation<unknown, unknown>[]
>(...args: Input): JointValidation<Input> {
  const values: unknown[] = [];
  const errors: unknown[] = [];

  for (const arg of args) {
    arg.fold(
      (value) => values.push(value),
      (errors_) => errors.push(...errors_)
    );
  }

  if (errors.length) {
    return Invalid(errors as never);
  }

  return Valid(values as never);
}
