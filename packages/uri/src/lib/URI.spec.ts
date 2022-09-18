import { pipe } from '@monument/core';
import { parseAuthority } from './Authority';
import { parsePath } from './Path';
import { parseQuery } from './Query';
import {
  parseURI,
  serializeURI,
  setAuthority,
  setFragment,
  setPath,
  setQuery,
  setScheme,
  URI,
} from './URI';

describe('parseURI', () => {
  test.each<{ source: string; result: URI }>([
    {
      source:
        'https://alex:secret@localhost:3200/path/to/resource?a=b&c=d&e=f#footer',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
        fragment: 'footer',
      },
    },
    {
      source: 'https://alex:secret@localhost:3200/path/to/resource?a=b&c=d&e=f',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'https://alex:secret@localhost:3200/path/to/resource#footer',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
        fragment: 'footer',
      },
    },
    {
      source: 'https://alex:secret@localhost:3200/path/to/resource',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: 'https://alex:secret@localhost:3200?a=b&c=d&e=f#footer',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
        fragment: 'footer',
      },
    },
    {
      source: 'https://alex:secret@localhost:3200?a=b&c=d&e=f',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'https://alex@localhost:3200?a=b&c=d&e=f',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'https://localhost:3200?a=b&c=d&e=f',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'https://localhost?a=b&c=d&e=f',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'https://alex:secret@localhost:3200#footer',
      result: {
        scheme: 'https',
        authority: {
          username: 'alex',
          password: 'secret',
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        fragment: 'footer',
      },
    },
    {
      source: '//localhost/path/to/resource',
      result: {
        authority: {
          host: 'localhost',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: 'https://localhost',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
      },
    },
    {
      source: '//localhost?a=b&c=d&e=f',
      result: {
        authority: {
          host: 'localhost',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: '//localhost',
      result: {
        authority: {
          host: 'localhost',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
      },
    },
    {
      source: 'https://localhost:3200/../path/./to/.././../resource/./../',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
      },
    },
    {
      source: 'https://localhost:3200/../path/to/../../resource/..',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
      },
    },
    {
      source: 'https://localhost:3200/../path/to/../../resource',
      result: {
        scheme: 'https',
        authority: {
          host: 'localhost',
          port: 3200,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: './../path/./to/.././../resource/./..',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '..',
            },
          ],
        },
      },
    },
    {
      source: '../path/./to/.././../resource/./..',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '..',
            },
          ],
        },
      },
    },
    {
      source: '../path/to/../../resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '..',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: '../path/to/resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '..',
            },
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: '/../path/to/../../resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: '/../path/to/resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: '/path/to/resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: './path/to/resource',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '.',
            },
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
      },
    },
    {
      source: './path/to/resource?a=b&c=d&e=f',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            {
              name: '.',
            },
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: '/path/to/resource?a=b&c=d&e=f',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            {
              name: 'path',
            },
            {
              name: 'to',
            },
            {
              name: 'resource',
            },
          ],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: '?a=b&c=d&e=f',
      result: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
        query: [
          ['a', 'b'],
          ['c', 'd'],
          ['e', 'f'],
        ],
      },
    },
    {
      source: 'mailto:alex@gmail.com',
      result: {
        scheme: 'mailto',
        path: {
          isOpaque: true,
          isHierarchical: false,
          content: 'alex@gmail.com',
        },
      },
    },
    {
      source: 'tel:+380501234567',
      result: {
        scheme: 'tel',
        path: {
          isOpaque: true,
          isHierarchical: false,
          content: '+380501234567',
        },
      },
    },
  ])('parse "$source"', ({ source, result }) => {
    expect(parseURI(source)).toEqual(result);
  });
});

describe('serializeURI', () => {
  test.each<{
    readonly source: URI;
    readonly result: string;
  }>([
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [],
        },
      },
      result: '.',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [{ name: 'a' }],
        },
      },
      result: './a',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [{ name: 'a' }, { name: 'b' }],
        },
      },
      result: './a/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [{ name: '..' }, { name: 'a' }, { name: 'b' }],
        },
      },
      result: '../a/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [
            { name: '..' },
            { name: '..' },
            { name: 'a' },
            { name: 'b' },
          ],
        },
      },
      result: '../../a/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [],
        },
      },
      result: '',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [{ name: 'a' }],
        },
      },
      result: '/a',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [{ name: 'a' }, { name: 'b' }],
        },
      },
      result: '/a/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [{ name: 'a' }, { name: '..' }, { name: 'b' }],
        },
      },
      result: '/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            { name: 'a' },
            { name: '..' },
            { name: '..' },
            { name: 'b' },
          ],
        },
      },
      result: '/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            { name: '..' },
            { name: 'a' },
            { name: '..' },
            { name: '..' },
            { name: 'b' },
          ],
        },
      },
      result: '/b',
    },
    {
      source: {
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            { name: '.' },
            { name: '..' },
            { name: 'a' },
            { name: '.' },
            { name: '..' },
            { name: '..' },
            { name: '.' },
            { name: 'b' },
            { name: '.' },
          ],
        },
      },
      result: '/b',
    },
    {
      source: {
        authority: {
          host: 'site.com',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [
            { name: '.' },
            { name: '..' },
            { name: 'a' },
            { name: '.' },
            { name: '..' },
            { name: '..' },
            { name: '.' },
            { name: 'b' },
            { name: '.' },
          ],
        },
      },
      result: '//site.com/b',
    },
    {
      source: {
        authority: {
          host: 'site.com',
          port: 3000,
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [{ name: 'a' }, { name: 'b' }],
        },
      },
      result: '//site.com:3000/a/b',
    },
    {
      source: {
        authority: {
          host: 'site.com',
          port: 3000,
          username: 'alex',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: true,
          segments: [{ name: 'a' }, { name: 'b' }],
        },
      },
      result: '//alex@site.com:3000/a/b',
    },
    {
      source: {
        authority: {
          host: 'site.com',
          port: 3000,
          username: 'alex',
        },
        path: {
          isOpaque: false,
          isHierarchical: true,
          isAbsolute: false,
          segments: [{ name: '..' }, { name: 'a' }, { name: 'b' }],
        },
      },
      result: '//alex@site.com:3000/a/b',
    },
  ])('serialize "$result"', ({ source, result }) => {
    if (result) {
      expect(serializeURI(source)).toBe(result);
    }
  });
});

describe.each([
  {
    uri: '//localhost:3000',
    scheme: 'https',
    result: 'https://localhost:3000',
  },
  {
    uri: 'http://localhost:3000',
    scheme: 'https',
    result: 'https://localhost:3000',
  },
  {
    uri: 'mail:alex@site.com',
    scheme: 'mailto',
    result: 'mailto:alex@site.com',
  },
])('setScheme', ({ uri, scheme, result }) => {
  describe(`given URI "${uri}"`, () => {
    describe(`set scheme to "${scheme}"`, () => {
      it(`should result to "${result}"`, () => {
        expect(pipe(parseURI, setScheme(scheme), serializeURI)(uri)).toBe(
          result,
        );
      });
    });
  });
});

describe.each([
  {
    uri: 'https://site.com?a=b#comments',
    authority: 'dev.site.com:3200',
    result: 'https://dev.site.com:3200?a=b#comments',
  },
])('setAuthority', ({ uri, authority, result }) => {
  describe(`given URI "${uri}"`, () => {
    describe(`set authority to "${authority}"`, () => {
      it(`should result to "${result}"`, () => {
        expect(
          pipe(
            parseURI,
            setAuthority(parseAuthority(authority)),
            serializeURI,
          )(uri),
        ).toBe(result);
      });
    });
  });
});

describe.each([
  {
    uri: 'https://site.com?a=b#comments',
    path: '/a/b/c',
    opaque: false,
    result: 'https://site.com/a/b/c?a=b#comments',
  },
  {
    uri: 'https://site.com?a=b#comments',
    path: '../a/b/c',
    opaque: false,
    result: 'https://site.com/a/b/c?a=b#comments',
  },
  {
    uri: 'mailto:alex@site.com',
    path: 'bob@company.com',
    opaque: true,
    result: 'mailto:bob@company.com',
  },
])('setPath', ({ uri, path, opaque, result }) => {
  describe(`given URI "${uri}"`, () => {
    describe(`set path to "${path}"`, () => {
      it(`should result to "${result}"`, () => {
        expect(
          pipe(parseURI, setPath(parsePath(opaque)(path)), serializeURI)(uri),
        ).toBe(result);
      });
    });
  });
});

describe.each([
  {
    uri: 'https://site.com?a=b#comments',
    query: 'a=1&b=2',
    result: 'https://site.com?a=1&b=2#comments',
  },
])('setQuery', ({ uri, query, result }) => {
  describe(`given URI "${uri}"`, () => {
    describe(`set query to "${query}"`, () => {
      it(`should result to "${result}"`, () => {
        expect(
          pipe(parseURI, setQuery(parseQuery(query)), serializeURI)(uri),
        ).toBe(result);
      });
    });
  });
});

describe.each([
  {
    uri: 'https://site.com?a=b#comments',
    fragment: 'spec',
    result: 'https://site.com?a=b#spec',
  },
])('setFragment', ({ uri, fragment, result }) => {
  describe(`given URI "${uri}"`, () => {
    describe(`set fragment to "${fragment}"`, () => {
      it(`should result to "${result}"`, () => {
        expect(pipe(parseURI, setFragment(fragment), serializeURI)(uri)).toBe(
          result,
        );
      });
    });
  });
});
