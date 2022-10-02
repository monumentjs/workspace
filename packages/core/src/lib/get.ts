/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepTypeOf } from './DeepTypeOf';
import { DeepPathOf } from './DeepPathOf';

export function get<T extends object, Path extends DeepPathOf<T>>(
  source: T,
  path: Path
): DeepTypeOf<T, Path> {
  return (path as any[]).reduce((current, key) => current[key], source);
}
