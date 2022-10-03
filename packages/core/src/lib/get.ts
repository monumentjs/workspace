/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepType } from './DeepType';
import { DeepKeys } from './DeepKeys';

export function get<T extends object, Path extends DeepKeys<T>>(
  source: T,
  path: Path
): DeepType<T, Path> {
  return (path as any[]).reduce((current, key) => current[key], source);
}
