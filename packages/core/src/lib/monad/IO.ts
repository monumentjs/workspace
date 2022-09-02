import { Func } from '../Func';

export interface IO<T> {
  map<R>(project: Func<[value: T], R>): IO<R>;
  flatMap<R>(project: Func<[value: T], IO<R>>): IO<R>;

  apply<R>(func: IO<Func<[T], R>>): IO<R>;
  applyTo<R>(
    value: IO<R>
  ): T extends Func<[R], unknown> ? IO<ReturnType<T>> : never;

  run(): T;
}

export function IO<T>(effect: Func<[], T>): IO<T> {
  return {
    map(project) {
      return IO(() => project(effect()));
    },
    flatMap(fn) {
      return IO(() => fn(effect()).run());
    },
    apply(func) {
      return func.map((fn) => fn(effect()));
    },
    applyTo(value) {
      return value.apply(this as never) as never;
    },
    run(): T {
      return effect();
    },
  };
}
