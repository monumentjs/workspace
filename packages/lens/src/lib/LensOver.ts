import { Func } from '@monument/core';

export type LensOver<T, V> = (map: Func<[value: V], V>) => (target: T) => T;
