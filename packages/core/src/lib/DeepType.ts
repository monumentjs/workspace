export type DeepType<T, Path> = Path extends [
  infer First extends keyof T,
  ...infer Rest
]
  ? DeepType<T[First], Rest>
  : T;
