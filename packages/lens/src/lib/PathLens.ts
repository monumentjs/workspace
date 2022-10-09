import { DeepKeys, DeepType, get, set } from '@monument/core';
import { Lens } from './Lens';

/**
 * Creates a lens for a nested property.
 *
 * @template T Type of the whole.
 * @template Path Typed path to a nested property.
 *
 * @returns A lens to the nested property.
 *
 * @example
 *
 * Given a data model:
 *
 * ```ts
 * interface Company {
 *   readonly id: number;
 *   readonly name: string;
 *   readonly description?: string;
 *   readonly address: Address;
 * }
 *
 * interface Address {
 *   readonly country: string;
 *   readonly region: string;
 *   readonly street: Street;
 *   readonly building: string;
 * }
 *
 * interface Street {
 *   readonly name: string;
 *   readonly kind: string;
 * }
 * ```
 *
 * Create a lens to a nested property:
 *
 * ```ts
 * const [
 *   getStreetName,
 *   setStreetName,
 *   overStreetName
 * ] = PathLens<Company>()('address', 'street', 'name');
 * ```
 *
 * Use "get" function to get a value of the nested property:
 *
 * ```ts
 * console.log(getStreetName(company));           // "Broadway"
 * ```
 *
 * Use "set" function to set a value of the nested property:
 *
 * ```ts
 * const newCompany = setStreetName("Main")(company);
 *
 * console.log(newCompany.address.street.name);   // "Main"
 * ```
 *
 * Use "over" function to map and set a value of the nested property:
 *
 * ```ts
 * const newCompany = overStreetName(toUpperCase)(company);
 *
 * console.log(newCompany.address.street.name);   // "BROADWAY"
 * ```
 */
export function PathLens<T extends object>() {
  return <Path extends DeepKeys<T>>(
    ...path: Path
  ): Lens<T, DeepType<T, Path>> => {
    return Lens(
      (source: T): DeepType<T, Path> => {
        return get(source, path);
      },
      (value: DeepType<T, Path>) => (target: T) => {
        return set(target, path, value);
      }
    );
  };
}
