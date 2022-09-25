export type Next<T, R> = (value: T) => R;
export type Middleware<T, R> = (value: T, next: Next<T, R>) => R;

export function chain<T, R>(
  first: Middleware<T, R>,
  ...rest: readonly Middleware<T, R>[]
) {
  const middlewares = [first, ...rest];

  return (input: T): R => {
    let index = -1;

    const next: Next<T, R> = (value) => {
      index++;

      const middleware = middlewares[index];

      return middleware(value, next);
    };

    return next(input);
  };
}
