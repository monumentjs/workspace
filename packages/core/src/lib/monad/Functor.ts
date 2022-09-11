import { Func } from '../Func';

export interface Functor<T> {
  map<R>(project: Func<[value: T], R>): Functor<R>;
}
