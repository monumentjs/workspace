import { parseQueryParam, QueryParam, serializeQueryParam } from './QueryParam';

export type Query = readonly QueryParam[];

const DELIMITER = '&';

export function parseQuery(query: string): Query {
  return query.split(DELIMITER).map(parseQueryParam);
}

export function serializeQuery(query: Query): string {
  return query.map(serializeQueryParam).join(DELIMITER);
}

export function addParam(query: Query, name: string, value: string): Query {
  return [...query, [name, value]];
}

export function removeParam(query: Query, name: string, value?: string): Query {
  return query.filter(([_name, _value]) => name !== _name && value !== _value);
}

export function setParam(query: Query, name: string, value: string): Query {
  return addParam(removeParam(query, name), name, value);
}
