import { Func } from '@monument/core';
import { Monad } from './Monad';

export interface IO<T> extends Monad<T> {
  map<R>(project: Func<[value: T], R>): IO<R>;

  flatMap<R>(project: Func<[value: T], IO<R>>): IO<R>;

  apply<R>(func: IO<Func<[T], R>>): IO<R>;
  applyTo<R>(
    value: IO<R>
  ): T extends Func<[R], unknown> ? IO<ReturnType<T>> : never;

  run(): T;
}

export function IO<T>(fn: Func<[], T>): IO<T> {
  return {
    map(project) {
      return IO(() => project(fn()));
    },
    flatMap(project) {
      return IO(() => project(fn()).run());
    },
    apply(func) {
      return func.map((project) => project(fn()));
    },
    applyTo(value) {
      return value.apply(this as never) as never;
    },
    run(): T {
      return fn();
    },
  };
}
