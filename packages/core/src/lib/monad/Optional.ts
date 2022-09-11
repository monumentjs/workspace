import { Func } from '../Func';
import { Monad } from './Monad';

export interface Optional<T> extends Iterable<T>, Monad<T> {
  readonly isPresent: boolean;
  readonly isAbsent: boolean;

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
  get isPresent() {
    return true;
  }

  get isAbsent() {
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
  get isPresent(): boolean {
    return false;
  }

  get isAbsent(): boolean {
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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Optional {
  export function fromNullable<T>(value: T): Optional<NonNullable<T>> {
    return value == null ? None() : Just(value as never);
  }
}
