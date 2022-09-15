import { Func } from '../Func';
import { Monad } from './Monad';

export interface AIO<T> extends Monad<T> {
  map<R>(project: Func<[value: T], R>): AIO<R>;

  flatMap<R>(project: Func<[value: T], AIO<R>>): AIO<R>;

  apply<R>(func: AIO<Func<[T], R>>): AIO<R>;
  applyTo<R>(
    value: AIO<R>
  ): T extends Func<[R], unknown> ? AIO<ReturnType<T>> : never;

  run(): Promise<T>;
}

export function AIO<T>(fn: Func<[], Promise<T>>): AIO<T> {
  return {
    map(project) {
      return AIO(() => fn().then(project));
    },
    flatMap(project) {
      return AIO(() => fn().then((v) => project(v).run()));
    },
    apply(func) {
      return func.flatMap((project) => AIO(() => fn().then(project)));
    },
    applyTo(value) {
      return value.apply(this as never) as never;
    },
    run(): Promise<T> {
      return fn();
    },
  };
}
