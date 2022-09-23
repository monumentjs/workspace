import { Func } from '@monument/core';

export interface Bind<T> {
  flatMap<R>(project: Func<[value: T], Bind<R>>): Bind<R>;
}
