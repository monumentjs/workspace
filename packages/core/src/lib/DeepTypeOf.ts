export type DeepTypeOf<T, Path> = Path extends [
  infer First extends keyof T,
  ...infer Rest
]
  ? DeepTypeOf<T[First], Rest>
  : T;
