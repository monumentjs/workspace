import { parseAuthority } from './Authority';

describe('parseAuthority', () => {
  test.each([
    {
      input: 'alex:secret@localhost:3200',
      result: {
        username: 'alex',
        password: 'secret',
        host: 'localhost',
        port: 3200,
      },
    },
    {
      input: 'alex@localhost:3200',
      result: {
        username: 'alex',
        host: 'localhost',
        port: 3200,
      },
    },
    {
      input: 'localhost:3200',
      result: {
        host: 'localhost',
        port: 3200,
      },
    },
    {
      input: 'alex@localhost',
      result: {
        username: 'alex',
        host: 'localhost',
      },
    },
    {
      input: 'localhost:',
      error: 'Invalid authority',
    },
    {
      input: 'localhost',
      result: {
        host: 'localhost',
      },
    },
    {
      input: '',
      error: 'Invalid authority',
    },
  ])('parse "$input"', ({ input, result, error }) => {
    if (result) {
      expect(parseAuthority(input)).toEqual(result);
    }

    if (error) {
      expect(() => parseAuthority(input)).toThrow(error);
    }
  });
});
