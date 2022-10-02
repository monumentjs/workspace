import { set } from './set';
import { DeepTypeOf } from './DeepTypeOf';
import { DeepPathOf } from './DeepPathOf';
import { SetterOf } from './SetterOf';

/**
 * Creates a setter for a nested property.
 *
 * @template T Type of the whole.
 *
 * @see {@link set}
 * @see {@link DeepPathOf}
 * @see {@link SetterOf}
 * @see {@link DeepTypeOf}
 *
 * @example
 *
 * Given a complex object structure:
 *
 * ```ts
 * interface Company {
 *   id: number;
 *   name: string;
 *   address: Address;
 * }
 *
 * interface Address {
 *   country: string;
 *   region: string;
 *   city: string;
 *   street: Street;
 *   building: string;
 * }
 *
 * interface Street {
 *   name: string;
 *   type: string;
 * }
 * ```
 *
 * Create a setter for specific type and given path to a nested property:
 *
 * ```ts
 * const setStreetName = createSetter<Company>()('address', 'street', 'name');
 * ```
 *
 * Use this setter to set a nested property:
 *
 * ```ts
 * const updatedCompany = setStreetName(company)('Broadway');
 * ```
 */
export function createSetter<T extends object>() {
  return <Path extends DeepPathOf<T>>(path: Path): SetterOf<T, Path> => {
    return (target: T) => {
      return (value: DeepTypeOf<T, Path>) => {
        return set(target, path, value);
      };
    };
  };
}
