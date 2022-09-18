import {
  HierarchicalPath,
  parseHierarchicalPath,
  serializeHierarchicalPath,
} from './HierarchicalPath';
import {
  createOpaquePath,
  OpaquePath,
  serializeOpaquePath,
} from './OpaquePath';

export type Path = OpaquePath | HierarchicalPath;

export function parsePath(isOpaque: boolean) {
  return (path: string): Path =>
    isOpaque ? createOpaquePath(path) : parseHierarchicalPath(path);
}

export function serializePath(path: Path): string {
  return path.isOpaque
    ? serializeOpaquePath(path)
    : serializeHierarchicalPath(path);
}
