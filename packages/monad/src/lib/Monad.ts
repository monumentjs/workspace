import { Func } from '@monument/core';
import { Applicative } from './Applicative';
import { Bind } from './Bind';
import { Functor } from './Functor';

export interface Monad<T> extends Functor<T>, Bind<T>, Applicative<T> {
  map<R>(project: Func<[value: T], R>): Monad<R>;

  flatMap<R>(project: Func<[value: T], Monad<R>>): Monad<R>;

  apply<V>(func: Monad<Func<[T], V>>): Monad<V>;
  applyTo<V>(
    value: Monad<V>
  ): T extends Func<[V], unknown> ? Monad<ReturnType<T>> : never;
}
