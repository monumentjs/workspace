import { Func } from '@monument/core';

export interface Functor<T> {
  map<R>(project: Func<[value: T], R>): Functor<R>;
}
