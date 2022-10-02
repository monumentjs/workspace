/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepTypeOf } from './DeepTypeOf';
import { DeepKeysOf } from './DeepKeysOf';

export function get<T extends object, Path extends DeepKeysOf<T>>(
  source: T,
  path: Path
): DeepTypeOf<T, Path> {
  return (path as any[]).reduce((current, key) => current[key], source);
}
