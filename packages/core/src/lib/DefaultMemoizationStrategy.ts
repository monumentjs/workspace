import { MemoizationStrategy } from './MemoizationStrategy';

export class DefaultMemoizationStrategy<T, R>
  implements MemoizationStrategy<T, R>
{
  private readonly cache = new Map<T, R>();

  has(value: T): boolean {
    return this.cache.has(value);
  }

  get(value: T): R | undefined {
    return this.cache.get(value);
  }

  set(value: T, result: R): void {
    this.cache.set(value, result);
  }

  delete(value: T): boolean {
    return this.cache.delete(value);
  }

  clear(): void {
    this.cache.clear();
  }
}
