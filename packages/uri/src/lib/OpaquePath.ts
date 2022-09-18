import { pipe } from '@monument/core';

export interface OpaquePath {
  readonly isOpaque: true;
  readonly isHierarchical: false;
  readonly content: string;
}

export const createOpaquePath = pipe(create, validate);

export const serializeOpaquePath = pipe(validate, serialize);

export function withContent(content: string) {
  return (path: OpaquePath) => validate({ ...path, content });
}

function create(content: string): OpaquePath {
  return {
    isOpaque: true,
    isHierarchical: false,
    content,
  };
}

function serialize(path: OpaquePath): string {
  return path.content;
}

function validate(path: OpaquePath): OpaquePath {
  if (path.content.length === 0) {
    throw new URIError('Content of opaque path must not be empty');
  }

  return path;
}
