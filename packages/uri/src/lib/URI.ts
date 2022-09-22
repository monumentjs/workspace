import { pipe } from '@monument/core';
import { Authority, parseAuthority, serializeAuthority } from './Authority';
import { Fragment, parseFragment, serializeFragment } from './Fragment';
import {
  HierarchicalPath,
  resolveHierarchicalPath,
  setAbsolute,
} from './HierarchicalPath';
import { parsePath, Path, serializePath } from './Path';
import { parseQuery, Query, serializeQuery } from './Query';
import { parseScheme, Scheme, serializeScheme } from './Scheme';

const PATTERN =
  /^((?<scheme>[^:/?#]+):)?(\/\/(?<authority>[^/?#]*))?(?<path>[^?#]*)(\?(?<query>[^#]*))?(#(?<fragment>.*))?/;

export interface URI {
  readonly scheme?: Scheme;
  readonly authority?: Authority;
  readonly path: Path;
  readonly query?: Query;
  readonly fragment?: Fragment;
}

export const createURI = pipe(normalize, validate);

export const parseURI = pipe(parse, normalize, validate);

export const serializeURI = pipe(validate, normalize, serialize);

export const setScheme = (scheme: Scheme) => (uri: URI) =>
  createURI({ ...uri, scheme });

export const setAuthority = (authority: Authority) => (uri: URI) =>
  createURI({ ...uri, authority });

export const setPath = (path: Path) => (uri: URI) =>
  createURI({ ...uri, path });

export const setQuery = (query: Query) => (uri: URI) =>
  createURI({ ...uri, query });

export const setFragment = (fragment: Fragment) => (uri: URI) =>
  createURI({ ...uri, fragment });

function parse(source: string): URI {
  const groups = source.match(PATTERN)?.groups;

  if (groups) {
    const { scheme, authority, path, query, fragment } = groups;

    const isOpaque = Boolean(scheme && !authority);

    return {
      scheme: scheme ? parseScheme(scheme) : undefined,
      authority: authority ? parseAuthority(authority) : undefined,
      path: parsePath(isOpaque)(path),
      query: query ? parseQuery(query) : undefined,
      fragment: fragment ? parseFragment(fragment) : undefined,
    };
  }

  throw new URIError('Invalid URI');
}

function serialize(uri: URI): string {
  const { scheme, authority, path, query, fragment } = uri;

  let result = '';

  if (scheme) {
    result += serializeScheme(scheme);
    result += ':';
  }

  if (authority) {
    result += '//';
    result += serializeAuthority(authority);
  }

  result += serializePath(path);

  if (query?.length) {
    result += '?';
    result += serializeQuery(query);
  }

  if (fragment) {
    result += '#';
    result += serializeFragment(fragment);
  }

  return result;
}

/**
 * Resolves a reference URI from base URI.
 * @param base Base URI
 * @param ref Reference URI
 * @returns a resolved URI
 * @alpha
 */
export function resolveURI(base: URI, ref: URI): URI {
  if (base.path.isOpaque) {
    throw new URIError('Invalid base URI: opaque path is not allowed');
  }

  if (ref.path.isOpaque) {
    throw new URIError('Invalid ref URI: opaque path is not allowed');
  }

  let scheme: Scheme | undefined;
  let authority: Authority | undefined;
  let path: HierarchicalPath;
  let query: Query | undefined;
  const fragment = ref.fragment;

  if (ref.scheme) {
    scheme = ref.scheme;
    authority = ref.authority;
    path = ref.path;
    query = ref.query;
  } else {
    if (ref.authority) {
      authority = ref.authority;
      path = ref.path;
      query = ref.query;
    } else {
      if (ref.path.segments.length === 0) {
        path = base.path;
        if (ref.query?.length) {
          query = ref.query;
        } else {
          query = base.query;
        }
      } else {
        path = resolveHierarchicalPath(base.path, ref.path);
        query = ref.query;
      }
      authority = base.authority;
    }
    scheme = base.scheme;
  }

  return { scheme, authority, path, query, fragment };
}

function normalize(uri: URI): URI {
  return {
    ...uri,
    path: uri.path.isHierarchical
      ? setAbsolute(uri.path.isAbsolute || Boolean(uri.authority))(uri.path)
      : uri.path,
  };
}

function validate(uri: URI): URI {
  if (uri.scheme) {
    if (!uri.authority) {
      if (uri.path.isHierarchical) {
        throw new URIError(
          'Hierarchical path is not allowed when authority is not defined'
        );
      }
    }
  }

  if (uri.authority) {
    if (uri.path.isOpaque) {
      throw new URIError('Opaque path is not allowed within absolute URI');
    }
  }

  return uri;
}
