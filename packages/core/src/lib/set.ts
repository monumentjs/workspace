import { DeepType } from './DeepType';
import { DeepKeys } from './DeepKeys';

/**
 * Creates a copy of the target object with the nested property set to the given value.
 * @template T A type of the target object.
 * @template Path A path to the nested property.
 * @param target A target object.
 * @param path A path to the nested propery.
 * @param value A new value of the nested property.
 * @returns A copy of the target object with the nested property set to the given value.
 */
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
