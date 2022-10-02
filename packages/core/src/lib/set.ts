import { DeepTypeOf } from './DeepTypeOf';
import { DeepKeysOf } from './DeepKeysOf';

export function set<T extends object, Path extends DeepKeysOf<T>>(
  target: T,
  path: Path,
  value: DeepTypeOf<T, Path>
): T {
  if (path.length) {
    const [key, ...rest] = path;

    return {
      ...target,
      [key]: set(target[key] as never, rest as never, value as never),
    };
  }

  return value as never;
}
