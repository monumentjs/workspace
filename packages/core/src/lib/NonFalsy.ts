import { Falsy } from './Falsy';

export type NonFalsy<T> = T extends Falsy ? never : T;
