import { Func } from '@monument/core';
import { Bind } from './Bind';
import { Functor } from './Functor';

export type TaskStateFold<E, R, T> = {
  readonly onInitial: Func<[], T>;
  readonly onPending: Func<[], T>;
  readonly onComplete: Func<[result: R], T>;
  readonly onFailed: Func<[error: E], T>;
};

export interface TaskState<E, R> extends Functor<R>, Bind<R> {
  readonly result: R;
  readonly error: E;
  readonly pending: boolean;
  readonly failed: boolean;
  readonly complete: boolean;

  map<T>(project: Func<[result: R], T>): TaskState<E, T>;

  flatMap<F, T>(
    project: Func<[result: R], TaskState<F, T>>
  ): TaskState<E | F, T>;

  catchMap<F>(handle: Func<[error: E], TaskState<F, R>>): TaskState<F, R>;

  forEach(callback: Func<[result: R], unknown>): TaskState<E, R>;
  forEachError(callback: Func<[error: E], unknown>): TaskState<E, R>;

  fold<T>(fold: TaskStateFold<E, R, T>): T;
}

class _Initial<E, R> implements TaskState<E, R> {
  get result(): R {
    throw new Error('Invalid state');
  }

  get error(): E {
    throw new Error('Invalid state');
  }

  readonly pending = false;
  readonly failed = false;
  readonly complete = false;

  map<T>(): TaskState<E, T> {
    return new _Initial();
  }

  flatMap<F, T>(): TaskState<E | F, T> {
    return new _Initial();
  }

  catchMap<F>(): TaskState<F, R> {
    return new _Initial();
  }

  forEach(): TaskState<E, R> {
    return this;
  }

  forEachError(): TaskState<E, R> {
    return this;
  }

  fold<T>({ onInitial }: TaskStateFold<E, R, T>): T {
    return onInitial();
  }
}

class _Pending<E, R> implements TaskState<E, R> {
  get result(): R {
    throw new Error('Invalid state');
  }

  get error(): E {
    throw new Error('Invalid state');
  }

  readonly pending = true;
  readonly failed = false;
  readonly complete = false;

  map<T>(): TaskState<E, T> {
    return new _Pending();
  }

  flatMap<F, T>(): TaskState<F | E, T> {
    return new _Pending();
  }

  catchMap<F>(): TaskState<F, R> {
    return new _Pending();
  }

  forEach(): TaskState<E, R> {
    return this;
  }

  forEachError(): TaskState<E, R> {
    return this;
  }

  fold<T>({ onPending }: TaskStateFold<E, R, T>): T {
    return onPending();
  }
}

class _Complete<E, R> implements TaskState<E, R> {
  get error(): E {
    throw new Error('Invalid state');
  }

  constructor(readonly result: R) {}

  readonly pending = false;
  readonly failed = false;
  readonly complete = true;

  map<T>(project: Func<[value: R], T>): TaskState<E, T> {
    return new _Complete(project(this.result));
  }

  flatMap<F, T>(
    project: Func<[value: R], TaskState<F, T>>
  ): TaskState<F | E, T> {
    return project(this.result);
  }

  catchMap<F>(): TaskState<F, R> {
    return new _Complete(this.result);
  }

  forEach(callback: Func<[value: R], unknown>): TaskState<E, R> {
    callback(this.result);

    return this;
  }

  forEachError(): TaskState<E, R> {
    return this;
  }

  fold<T>({ onComplete }: TaskStateFold<E, R, T>): T {
    return onComplete(this.result);
  }
}

class _Failed<E, R> implements TaskState<E, R> {
  get result(): R {
    throw new Error('Invalid state');
  }

  constructor(readonly error: E) {}

  readonly pending = false;
  readonly failed = true;
  readonly complete = false;

  map<T>(): TaskState<E, T> {
    return new _Failed(this.error);
  }

  flatMap<F, T>(): TaskState<F | E, T> {
    return new _Failed(this.error);
  }

  catchMap<F>(handle: Func<[error: E], TaskState<F, R>>): TaskState<F, R> {
    return handle(this.error);
  }

  forEach(): TaskState<E, R> {
    return this;
  }

  forEachError(callback: Func<[error: E], unknown>): TaskState<E, R> {
    callback(this.error);

    return this;
  }

  fold<T>({ onFailed }: TaskStateFold<E, R, T>): T {
    return onFailed(this.error);
  }
}

export function Initial<E, T>(): TaskState<E, T> {
  return new _Initial();
}

export function Pending<E, T>(): TaskState<E, T> {
  return new _Pending();
}

export function Complete<E, T>(result: T): TaskState<E, T> {
  return new _Complete(result);
}

export function Failed<E, T>(error: E): TaskState<E, T> {
  return new _Failed(error);
}
