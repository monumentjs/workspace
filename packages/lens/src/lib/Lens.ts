import { LensGetter } from './LensGetter';
import { LensOver } from './LensOver';
import { LensSetter } from './LensSetter';

/**
 * Represents a lens.
 *
 * Lenses are functional getters and setters.
 *
 * @template T Type of the whole.
 * @template V Type of the property.
 */
export type Lens<T, V> = readonly [
  LensGetter<T, V>,
  LensSetter<T, V>,
  LensOver<T, V>
];

/**
 * Creates a lens to the certain value of the whole.
 *
 * @template T Type of the whole.
 * @template V Type of the value.
 *
 * @param get A value getter.
 * @param set A value setter.
 *
 * @returns A lens to the value.
 */
export function Lens<T, V>(
  get: LensGetter<T, V>,
  set: LensSetter<T, V>
): Lens<T, V> {
  const over: LensOver<T, V> = (map) => (whole) => set(map(get(whole)))(whole);

  return [get, set, over];
}
