import { DeepType } from './DeepType';
import { DeepKeys } from './DeepKeys';

export function set<T extends object, Path extends DeepKeys<T>>(
  target: T,
  path: Path,
  value: DeepType<T, Path>
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
