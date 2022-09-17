export interface MemoizationStrategy<T, R> {
  has(value: T): boolean;
  get(value: T): R | undefined;
  set(value: T, result: R): void;
  delete(value: T): boolean;
  clear(): void;
}
