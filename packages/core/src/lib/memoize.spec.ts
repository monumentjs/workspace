import { Func } from './Func';
import { memoize } from './memoize';

describe('memoize', () => {
  describe('using DefaultMemoizationStrategy', () => {
    let fn: jest.Mock;
    let total: Func<[numbers: readonly number[]], number>;

    beforeEach(() => {
      fn = jest.fn((numbers: readonly number[]) =>
        numbers.reduce((r, n) => r + n, 0)
      );
      total = memoize(fn);
    });

    it('should call the function only on unique values', () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];

      expect(total(a)).toBe(6);
      expect(total(a)).toBe(6);
      expect(total(b)).toBe(6);
      expect(total(b)).toBe(6);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, a);
      expect(fn).toHaveBeenNthCalledWith(2, b);
    });
  });
});
