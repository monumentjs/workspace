export const SINGLE_DOT = '.';
export const DOUBLE_DOT = '..';

export interface PathSegment {
  readonly name: string;
  readonly attributes?: PathSegmentAttributes;
}

export type PathSegmentAttribute = readonly [string, string?];

export type PathSegmentAttributes = readonly PathSegmentAttribute[];

export function parsePathSegment(source: string): PathSegment {
  return validate({
    name: decodeURIComponent(source),
    // todo: parse attributes
  });
}

export function serializePathSegment(segment: PathSegment): string {
  return encodeURIComponent(validate(segment).name); //todo: serialize attributes
}

export function isDot(segment: PathSegment): boolean {
  return segment.name === SINGLE_DOT || segment.name === DOUBLE_DOT;
}

export function isSingleDot(segment: PathSegment): boolean {
  return segment.name === SINGLE_DOT;
}

export function isDoubleDot(segment: PathSegment): boolean {
  return segment.name === DOUBLE_DOT;
}

export function setName(name: string) {
  return (segment: PathSegment) => validate({ ...segment, name });
}

export function setAttributes(attributes: PathSegmentAttributes | undefined) {
  return (segment: PathSegment) => validate({ ...segment, attributes });
}

export function hasAttributes(segment: PathSegment): boolean {
  return Boolean(segment.attributes?.length);
}

function validate(segment: PathSegment): PathSegment {
  if (segment.name.length === 0) {
    throw new URIError('Path segment name cannot be empty');
  }

  return segment;
}
