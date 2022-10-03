/**
 * Declares a type-safe path to the nested property.
 *
 * Notice: making path through optional properties is not possible.
 *
 * @template T Type of the whole.
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
 * Use it to declare a type-safe tuple with a path to specific nested property:
 *
 * ```ts
 * const correctPath: DeepPath<Company> = ['address', 'street', 'name']; // ok
 * const wrongPath: DeepPath<Company> = ['address', 'street', 'kind'];   // compilation error
 * ```
 *
 * Use it to declare a generic type-safe path:
 *
 * ```ts
 * export function get<T, Path extends DeepPath<T>>(source: T, path: Path): DeepType<T, Path> {
 *   // ...
 * }
 * ```
 *
 * Use the function:
 *
 * ```ts
 * const streetName = get(company, ['address', 'street', 'name']);
 * const streetType = get(company, ['address', 'street', 'type']);
 * const region = get(company, ['address', 'region']);
 * ```
 */
export type DeepKeys<T> = {
  [K in keyof Required<T>]:
    | [K]
    | (T[K] extends object ? [K, ...DeepKeys<T[K]>] : never);
}[keyof T];
