import { Func } from '../Func';

export interface Bind<T> {
  flatMap<R>(project: Func<[value: T], Bind<R>>): Bind<R>;
}
