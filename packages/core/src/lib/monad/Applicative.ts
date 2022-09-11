import { Func } from '../Func';

export interface Applicative<T> {
  apply<V>(func: Applicative<Func<[T], V>>): Applicative<V>;
  applyTo<V>(
    value: Applicative<V>
  ): T extends Func<[V], unknown> ? Applicative<ReturnType<T>> : never;
}
