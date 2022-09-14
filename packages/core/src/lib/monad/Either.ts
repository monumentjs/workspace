import { Func } from '../Func';
import { Monad } from './Monad';

export interface Either<L, R> extends Iterable<R>, Monad<R> {
  readonly isLeft: boolean;
  readonly isRight: boolean;

  left(): L | undefined;
  left(fallback: Func<[], L>): L;

  right(): R | undefined;
  right(fallback: Func<[], R>): R;

  map<T>(project: Func<[value: R], T>): Either<L, T>;
  mapLeft<T>(project: Func<[value: L], T>): Either<T, R>;

  flatMap<T>(project: Func<[value: R], Either<L, T>>): Either<L, T>;
  flatMapLeft<T>(project: Func<[value: L], Either<T, R>>): Either<T, R>;

  bimap<A, B>(
    projectLeft: Func<[value: L], A>,
    projectRight: Func<[value: R], B>
  ): Either<A, B>;

  swap(): Either<R, L>;

  forEach(callback: Func<[value: R], unknown>): Either<L, R>;
  forEachLeft(callback: Func<[value: L], unknown>): Either<L, R>;

  apply<T>(func: Either<L, Func<[value: R], T>>): Either<L, T>;
  applyTo<T>(
    value: Either<L, T>
  ): R extends Func<[T], unknown> ? Either<L, ReturnType<R>> : never;

  fold<T>(projectLeft: Func<[L], T>, projectRight: Func<[R], T>): T;
}

class Left_<L, R> implements Either<L, R> {
  get isLeft() {
    return true;
  }

  get isRight() {
    return false;
  }

  constructor(private readonly value: L) {}

  *[Symbol.iterator]() {
    // yield nothing
  }

  left(): L | undefined;
  left(fallback: Func<[], L>): L;
  left(): L | undefined {
    return this.value;
  }

  right(): R | undefined;
  right(fallback: Func<[], R>): R;
  right(fallback?: Func<[], R>): R | undefined {
    return fallback?.();
  }

  map<T>(): Either<L, T> {
    return this as never;
  }

  mapLeft<T>(project: Func<[value: L], T>): Either<T, R> {
    return new Left_(project(this.value));
  }

  flatMap<T>(): Either<L, T> {
    return this as never;
  }

  flatMapLeft<T>(handle: Func<[value: L], Either<T, R>>): Either<T, R> {
    return handle(this.value);
  }

  bimap<LL, RR>(projectLeft: Func<[value: L], LL>): Either<LL, RR> {
    return new Left_(projectLeft(this.value));
  }

  swap(): Either<R, L> {
    return new Right_(this.value) as never;
  }

  forEach(): Either<L, R> {
    return this;
  }

  forEachLeft(callback: Func<[value: L], unknown>): Either<L, R> {
    callback(this.value);

    return this;
  }

  apply<T>(): Either<L, T> {
    return this as never;
  }

  applyTo<T>(): R extends Func<[T], unknown>
    ? Either<L, ReturnType<R>>
    : never {
    return this as never;
  }

  fold<T>(projectLeft: Func<[L], T>): T {
    return projectLeft(this.value);
  }
}

class Right_<L, R> implements Either<L, R> {
  get isLeft() {
    return false;
  }

  get isRight() {
    return true;
  }

  constructor(private readonly value: R) {}

  *[Symbol.iterator]() {
    yield this.value;
  }

  left(): L | undefined;
  left(fallback: Func<[], L>): L;
  left(fallback?: Func<[], L>): L | undefined {
    return fallback?.();
  }

  right(): R | undefined;
  right(fallback: Func<[], R>): R;
  right(): R | undefined {
    return this.value;
  }

  map<T>(project: Func<[value: R], T>): Either<L, T> {
    return new Right_(project(this.value));
  }

  mapLeft<T>(): Either<T, R> {
    return this as never;
  }

  flatMap<T>(project: Func<[value: R], Either<L, T>>): Either<L, T> {
    return project(this.value);
  }

  flatMapLeft<T>(): Either<T, R> {
    return this as never;
  }

  bimap<LL, RR>(
    projectLeft: Func<[value: L], LL>,
    projectRight: Func<[value: R], RR>
  ): Either<LL, RR> {
    return new Right_(projectRight(this.value));
  }

  swap(): Either<R, L> {
    return new Left_(this.value);
  }

  forEach(callback: Func<[value: R], unknown>): Either<L, R> {
    callback(this.value);

    return this;
  }

  forEachLeft(): Either<L, R> {
    return this;
  }

  apply<T>(func: Either<L, Func<[value: R], T>>): Either<L, T> {
    return func.map((fn) => fn(this.value));
  }

  applyTo<T>(
    value: Either<L, T>
  ): R extends Func<[T], unknown> ? Either<L, ReturnType<R>> : never {
    return value.apply(this as never) as never;
  }

  fold<T>(projectLeft: Func<[L], T>, projectRight: Func<[R], T>): T {
    return projectRight(this.value);
  }
}

export function Left<L, R>(value: L): Either<L, R> {
  return new Left_(value);
}

export function Right<L, R>(value: R): Either<L, R> {
  return new Right_(value);
}

export function eitherFromTry<T, E = unknown>(fn: Func<[], T>): Either<E, T> {
  try {
    return Right(fn());
  } catch (e) {
    return Left(e as E);
  }
}

export function eitherFromPromise<T, E = unknown>(
  promise: Promise<T>
): Promise<Either<E, T>> {
  return promise.then(
    (v) => Right(v),
    (e) => Left(e)
  );
}
