export type QueryParam = readonly [string, string];

const DELIMITER = '=';

export function createQueryParam(name: string, value: string): QueryParam {
  return validate([name, value]);
}

export function parseQueryParam(source: string): QueryParam {
  const [name, value] = source.split(DELIMITER, 2);

  return createQueryParam(
    decodeURIComponent(name),
    value ? decodeURIComponent(value) : '',
  );
}

export function serializeQueryParam(param: QueryParam): string {
  return param.map(encodeURIComponent).join(DELIMITER);
}

function validate(param: QueryParam): QueryParam {
  if (!param[0]) {
    throw new URIError('Invalid query param name');
  }

  return param;
}
