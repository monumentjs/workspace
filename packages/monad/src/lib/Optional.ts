import { Func, NonFalsy } from '@monument/core';
import { Monad } from './Monad';
import { Either, Left, Right } from './Either';
import { Invalid, Valid, Validation } from './Validation';

export interface Optional<T> extends Iterable<T>, Monad<T> {
  readonly isJust: boolean;
  readonly isNone: boolean;

  value(): T | undefined;
  value(fallback: Func<[], T>): T;

  map<R>(project: Func<[value: T], R>): Optional<R>;

  flatMap<R>(project: Func<[value: T], Optional<R>>): Optional<R>;
  catchMap(fallback: Func<[], Optional<T>>): Optional<T>;

  forEach(callback: Func<[value: T], unknown>): Optional<T>;

  apply<R>(func: Optional<Func<[T], R>>): Optional<R>;
  applyTo<R>(
    value: Optional<R>
  ): T extends Func<[R], unknown> ? Optional<ReturnType<T>> : never;

  fold<R>(onPresent: Func<[value: T], R>, onAbsent: Func<[], R>): R;
}

class Just_<T> implements Optional<T> {
  get isJust() {
    return true;
  }

  get isNone() {
    return false;
  }

  constructor(private readonly _value: T) {
    if (_value == null) {
      throw new Error('Invalid argument: Just cannot have a nullable value');
    }
  }

  *[Symbol.iterator]() {
    yield this._value;
  }

  value(): T | undefined;
  value(fallback: Func<[], T>): T;
  value() {
    return this._value;
  }

  map<R>(project: Func<[value: T], R>): Optional<R> {
    return new Just_(project(this._value));
  }

  flatMap<R>(project: Func<[value: T], Optional<R>>): Optional<R> {
    return project(this._value);
  }

  catchMap(): Optional<T> {
    return this;
  }

  forEach(callback: Func<[value: T], unknown>): Optional<T> {
    callback(this._value);

    return this;
  }

  apply<R>(func: Optional<Func<[T], R>>): Optional<R> {
    return func.map((fn) => fn(this._value));
  }

  applyTo<R>(
    value: Optional<R>
  ): T extends Func<[R], unknown> ? Optional<ReturnType<T>> : never {
    return value.apply(this as never) as never;
  }

  fold<R>(onPresent: Func<[value: T], R>): R {
    return onPresent(this._value);
  }
}

class None_<T> implements Optional<T> {
  get isJust(): boolean {
    return false;
  }

  get isNone(): boolean {
    return true;
  }

  *[Symbol.iterator]() {
    // yield nothing
  }

  value(): T | undefined;
  value(fallback: Func<[], T>): T;
  value(fallback?: Func<[], T>): T | undefined {
    return fallback?.();
  }

  map<R>(): Optional<R> {
    return this as never;
  }

  flatMap<R>(): Optional<R> {
    return this as never;
  }

  catchMap(fallback: Func<[], Optional<T>>): Optional<T> {
    return fallback();
  }

  forEach(): Optional<T> {
    return this;
  }

  apply<R>(): Optional<R> {
    return this as unknown as Optional<R>;
  }

  applyTo<R>(
    value: Optional<R>
  ): T extends Func<[R], unknown> ? Optional<ReturnType<T>> : never {
    return value.apply(this as never) as never;
  }

  fold<R>(onPresent: Func<[value: T], R>, onAbsent: Func<[], R>): R {
    return onAbsent();
  }
}

export function Just<T>(value: T): Optional<T> {
  return new Just_(value);
}

export function None<T>(): Optional<T> {
  return new None_<T>();
}

export function nullableToOptional<T>(value: T): Optional<NonNullable<T>> {
  return value == null ? None() : Just(value as NonNullable<T>);
}

export function falsyToOptional<T>(value: T): Optional<NonFalsy<T>> {
  return value ? Just(value as NonFalsy<T>) : None();
}

export function optionalToEither<L, R>(
  optional: Optional<R>,
  fallback: Func<[], L>
): Either<L, R> {
  return optional.fold(
    (v) => Right(v),
    () => Left(fallback())
  );
}

export function optionalToValidation<E, V>(
  optional: Optional<V>,
  fallback: Func<[], readonly E[]> = () => []
): Validation<E, V> {
  return optional.fold(
    (v) => Valid(v),
    () => Invalid(fallback())
  );
}
