export type LensSetter<T, V> = (value: V) => (target: T) => T;
