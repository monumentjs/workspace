import { DeepTypeOf } from './DeepTypeOf';
import { get } from './get';
import { Getter } from './Getter';
import { DeepPathOf } from './DeepPathOf';

export function createGetter<T extends object>() {
  return <Path extends DeepPathOf<T>>(
    path: Path
  ): Getter<T, DeepTypeOf<T, Path>> => {
    return (source: T): DeepTypeOf<T, Path> => {
      return get(source, path);
    };
  };
}
