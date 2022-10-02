export type Setter<T, V> = (target: T) => (value: V) => T;
