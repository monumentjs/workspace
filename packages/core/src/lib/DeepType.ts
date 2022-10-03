/**
 * Picks a type of nested property.
 *
 * @template T Type of the whole.
 * @template Path Path to the nested property as an array of keys.
 *
 * @example
 *
 * Given a complex object structure:
 *
 * ```ts
 * interface Company {
 *   id: number;
 *   name: string;
 *   description?: string;
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
 * Use it to pick a type of nested property:
 *
 * ```ts
 * DeepType<Company, ['id']> == number
 * DeepType<Company, ['name']> == string
 * DeepType<Company, ['description']> == string | undefined
 * DeepType<Company, ['some']> == never
 * DeepType<Company, ['address']> == Address
 * DeepType<Company, ['address', 'country']> == string
 * DeepType<Company, ['address', 'street']> == Street
 * DeepType<Company, ['address', 'street', 'name']> == string
 * ```
 */
export type DeepType<T, Path> = T extends object
  ? Path extends [infer First extends keyof T, ...infer Rest]
    ? DeepType<T[First], Rest>
    : T
  : Path extends []
  ? T
  : never;
