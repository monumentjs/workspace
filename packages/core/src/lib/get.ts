/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepType } from './DeepType';
import { DeepKeys } from './DeepKeys';

/**
 * Gets a nested property of the source object described as a list of property keys.
 * @template T A type of the source object.
 * @template Path A path to the nested property.
 * @param source A source object.
 * @param path A path to the nested property.
 * @returns A value of the nested property.
 */
export function get<T extends object, Path extends DeepKeys<T>>(
  source: T,
  path: Path
): DeepType<T, Path> {
  return (path as any[]).reduce((current, key) => current[key], source);
}
