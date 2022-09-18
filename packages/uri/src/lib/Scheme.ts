import { pipe } from '@monument/core';

export type Scheme = string;

export const parseScheme = pipe(normalize, validate);

export const serializeScheme = pipe(validate, normalize);

function normalize(scheme: Scheme): Scheme {
  return scheme.toLowerCase();
}

function validate(scheme: Scheme): Scheme {
  if (scheme.length === 0) {
    throw new URIError('Scheme cannot be empty');
  }

  return scheme;
}
