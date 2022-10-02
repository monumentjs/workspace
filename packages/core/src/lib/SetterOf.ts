import { DeepPathOf } from './DeepPathOf';
import { DeepTypeOf } from './DeepTypeOf';
import { Setter } from './Setter';

/**
 * Declares a setter of a nested property.
 *
 * ```ts
 * SetterOf<Company, ['address', 'city']> == Setter<Company, string> == (whole: Company) => (city: string) => Company
 * ```
 *
 * @template T Type of the whole.
 * @template Path Path to a nested property.
 *
 * @see {@link Setter}
 * @see {@link assocOf}
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
 * Declare a setter for a nested property:
 *
 * ```ts
 * const setStreetName: SetterOf<Company, ['address', 'street', 'name']> = createSetterFunction();
 * ```
 *
 * Use a setter function:
 *
 * ```ts
 * const newCompany = setStreetName(company)('Broadway');
 * ```
 */
export type SetterOf<T extends object, Path extends DeepPathOf<T>> = Setter<
  T,
  DeepTypeOf<T, Path>
>;
