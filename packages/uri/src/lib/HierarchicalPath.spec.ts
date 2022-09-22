import { pipe } from '@monument/core';
import {
  HierarchicalPath,
  resolveHierarchicalPath,
  parseHierarchicalPath,
  setAbsolute,
  setSegments,
} from './HierarchicalPath';
import { serializePath } from './Path';

describe.each<{
  path: string;
  result: HierarchicalPath;
}>([
  {
    path: '',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [],
    },
  },
  {
    path: '.',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '.' }],
    },
  },
  {
    path: './.',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '.' }],
    },
  },
  {
    path: '././.',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '.' }],
    },
  },
  {
    path: '..',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }],
    },
  },
  {
    path: '../.',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }],
    },
  },
  {
    path: '../..',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }, { name: '..' }],
    },
  },
  {
    path: '../../.',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }, { name: '..' }],
    },
  },
  {
    path: '../../..',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }, { name: '..' }, { name: '..' }],
    },
  },
  {
    path: '/a/b/c',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    },
  },
  {
    path: '/a/../c',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'c' }],
    },
  },
  {
    path: '/a/../../c',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'c' }],
    },
  },
  {
    path: '/a/../../c/..',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [],
    },
  },
])('parseHierarchicalPath', ({ path, result }) => {
  describe(`given path "${path}"`, () => {
    it('should parse', () => {
      expect(parseHierarchicalPath(path)).toEqual(result);
    });
  });
});

describe.each<{
  base: string;
  ref: string;
  result: HierarchicalPath;
}>([
  {
    base: '/a/../../c/..',
    ref: '/c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'c' }, { name: 'd' }],
    },
  },
  {
    base: '/a/../../c/..',
    ref: './c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'c' }, { name: 'd' }],
    },
  },
  {
    base: './a/b',
    ref: './c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [
        { name: '.' },
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
      ],
    },
  },
  {
    base: '..',
    ref: './c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }, { name: 'c' }, { name: 'd' }],
    },
  },
  {
    base: '.',
    ref: './c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '.' }, { name: 'c' }, { name: 'd' }],
    },
  },
  {
    base: '.',
    ref: '../c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: false,
      segments: [{ name: '..' }, { name: 'c' }, { name: 'd' }],
    },
  },
  {
    base: '/',
    ref: '../c/d',
    result: {
      isOpaque: false,
      isHierarchical: true,
      isAbsolute: true,
      segments: [{ name: 'c' }, { name: 'd' }],
    },
  },
])('mergeHierarchicalPath', ({ base, ref, result }) => {
  describe(`given base "${base}" and ref "${ref}"`, () => {
    it('should parse', () => {
      expect(
        resolveHierarchicalPath(
          parseHierarchicalPath(base),
          parseHierarchicalPath(ref)
        )
      ).toEqual(result);
    });
  });
});

describe.each([
  {
    path: '/a/b/c',
    isAbsolute: true,
    result: '/a/b/c',
  },
  {
    path: '/a/b/c',
    isAbsolute: false,
    result: './a/b/c',
  },
  {
    path: '../a/b/c',
    isAbsolute: false,
    result: '../a/b/c',
  },
  {
    path: '../a/b/c',
    isAbsolute: true,
    result: '/a/b/c',
  },
])('setAbsolute', ({ path, isAbsolute, result }) => {
  describe(`given path "${path}"`, () => {
    describe(`set absolute to ${isAbsolute}`, () => {
      it(`should result to "${result}"`, () => {
        expect(
          pipe(
            parseHierarchicalPath,
            setAbsolute(isAbsolute),
            serializePath
          )(path)
        ).toBe(result);
      });
    });
  });
});

describe.each([
  {
    path: '/a/b/c',
    segments: [{ name: 'd' }, { name: 'e' }, { name: 'f' }],
    result: '/d/e/f',
  },
  {
    path: './a/b/c',
    segments: [{ name: 'd' }, { name: 'e' }, { name: 'f' }],
    result: './d/e/f',
  },
])('setSegments', ({ path, segments, result }) => {
  describe(`given path "${path}"`, () => {
    describe(`set segments to ${segments.map((s) => s.name).join()}`, () => {
      it(`should result to "${result}"`, () => {
        expect(
          pipe(
            parseHierarchicalPath,
            setSegments(segments),
            serializePath
          )(path)
        ).toBe(result);
      });
    });
  });
});
