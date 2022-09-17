import { DefaultMemoizationStrategy } from './DefaultMemoizationStrategy';
import { Func } from './Func';
import { MemoizationStrategy } from './MemoizationStrategy';

export function memoize<T, R>(
  fn: Func<[T], R>,
  strategy: MemoizationStrategy<T, R> = new DefaultMemoizationStrategy()
): Func<[T], R> {
  return function (value: T): R {
    if (strategy.has(value)) {
      return strategy.get(value) as R;
    }

    const result = fn(value);

    strategy.set(value, result);

    return result;
  };
}
