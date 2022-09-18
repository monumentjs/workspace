import {
  isDot,
  isDoubleDot,
  isSingleDot,
  parsePathSegment,
  PathSegment,
  serializePathSegment,
  SINGLE_DOT,
} from './PathSegment';

const DELIMITER = '/';

export interface HierarchicalPath {
  readonly isOpaque: false;
  readonly isHierarchical: true;
  readonly isAbsolute: boolean;
  readonly segments: readonly PathSegment[];
}

export function createHierarchicalPath(
  isAbsolute: boolean,
  segments: readonly PathSegment[],
): HierarchicalPath {
  return validate(normalize(create(isAbsolute, segments)));
}

export function parseHierarchicalPath(path: string): HierarchicalPath {
  return createHierarchicalPath(
    path.length === 0 || path.startsWith(DELIMITER),
    path.split(DELIMITER).filter(Boolean).map(parsePathSegment),
  );
}

export function serializeHierarchicalPath(path: HierarchicalPath): string {
  const { isAbsolute, segments } = normalize(validate(path));
  const prefix = isAbsolute && segments.length ? DELIMITER : '';

  return prefix + segments.map(serializePathSegment).join(DELIMITER);
}

export function setAbsolute(isAbsolute: boolean) {
  return (path: HierarchicalPath) =>
    createHierarchicalPath(isAbsolute, path.segments);
}

export function setSegments(segments: readonly PathSegment[]) {
  return (path: HierarchicalPath) =>
    createHierarchicalPath(path.isAbsolute, segments);
}

function create(
  isAbsolute: boolean,
  segments: readonly PathSegment[],
): HierarchicalPath {
  return {
    isOpaque: false,
    isHierarchical: true,
    isAbsolute,
    segments,
  };
}

function normalize(path: HierarchicalPath): HierarchicalPath {
  const { isAbsolute, segments } = path;
  const result: PathSegment[] = [];

  for (const segment of segments) {
    if (isSingleDot(segment)) {
      continue;
    }

    if (isDoubleDot(segment)) {
      if (
        isAbsolute ||
        (result.length && !isDoubleDot(result[result.length - 1]))
      ) {
        result.pop();

        continue;
      }
    }

    result.push(segment);
  }

  if (!isAbsolute && (!result.length || !isDoubleDot(result[0]))) {
    result.unshift({ name: SINGLE_DOT });
  }

  return {
    isOpaque: false,
    isHierarchical: true,
    isAbsolute,
    segments: result,
  };
}

function validate(path: HierarchicalPath): HierarchicalPath {
  if (path.isAbsolute && path.segments.length > 0 && isDot(path.segments[0])) {
    throw new URIError('Absolute path cannot start with dot segment');
  }

  return path;
}
