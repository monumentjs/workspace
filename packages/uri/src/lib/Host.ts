import { pipe } from '@monument/core';

export type Host = string;

export const createHost = pipe(normalize, validate);

export const parseHost = pipe(decodeURIComponent, createHost);

export const serializeHost = pipe(validate, normalize, encodeURIComponent);

function validate(host: Host): Host {
  if (host.length === 0) {
    throw new URIError('Host cannot be empty');
  }

  return host;
}

function normalize(host: Host): Host {
  return host.toLowerCase();
}
