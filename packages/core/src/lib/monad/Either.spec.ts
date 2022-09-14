import { Func } from '../Func';
import { promiseToEither, tryToEither, Left, Right } from './Either';

describe('Either', () => {
  describe('map', () => {
    describe('when Left', () => {
      it('should return the original', () => {
        const original = Left('a');
        const result = original.map(() => 42);

        expect(result).toBe(original);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect(result.left()).toBe('a');
        expect(result.right()).toBeUndefined();
      });
    });

    describe('when Right', () => {
      it('should create a new Right with mapped value', () => {
        const original = Right('a');
        const result = original.map(() => 42);

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe(42);
      });
    });
  });

  describe('leftMap', () => {
    describe('when Left', () => {
      it('should create a new Left with mapped value', () => {
        const original = Left('a');
        const result = original.mapLeft(() => 42);

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect(result.left()).toBe(42);
        expect(result.right()).toBeUndefined();
      });
    });

    describe('when Right', () => {
      it('should return the original', () => {
        const original = Right('a');
        const result = original.mapLeft(() => 42);

        expect(result).toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe('a');
      });
    });
  });

  describe('flatMap', () => {
    describe('when Left', () => {
      it('should return the original', () => {
        const original = Left('a');
        const result = original.flatMap(() => Right(42));

        expect(result).toBe(original);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect(result.left()).toBe('a');
        expect(result.right()).toBeUndefined();
      });
    });

    describe('when Right', () => {
      it('should return the calculated value', () => {
        const original = Right('a');
        const result = original.flatMap(() => Right(42));

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe(42);
      });
    });
  });

  describe('catchMap', () => {
    describe('when Left', () => {
      it('should return the calculated value', () => {
        const original = Left('a');
        const result = original.flatMapLeft(() => Right(42));

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe(42);
      });
    });
  });

  describe('when Right', () => {
    it('should return the original', () => {
      const original = Right('a');
      const result = original.flatMapLeft(() => Right('b'));

      expect(result).toBe(original);

      expect(result.isLeft).toBe(false);
      expect(result.isRight).toBe(true);

      expect(result.left()).toBeUndefined();
      expect(result.right()).toBe('a');
    });
  });

  describe('bimap', () => {
    describe('when Left', () => {
      it('should return the mapped left value', () => {
        const original = Left(42);
        const result = original.bimap(
          () => 'left',
          () => 'right'
        );

        expect(result.left()).toBe('left');
      });
    });

    describe('when Right', () => {
      it('should return the mapped right value', () => {
        const original = Right(42);
        const result = original.bimap(
          () => 'left',
          () => 'right'
        );

        expect(result.right()).toBe('right');
      });
    });
  });

  describe('swap', () => {
    describe('when Left', () => {
      it('should return Right with the same value', () => {
        const original = Left(42);
        const result = original.swap();

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);
        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe(42);
      });
    });
  });

  describe('when Right', () => {
    it('should return Left with the same value', () => {
      const original = Right(42);
      const result = original.swap();

      expect(result.isLeft).toBe(true);
      expect(result.isRight).toBe(false);
      expect(result.left()).toBe(42);
      expect(result.right()).toBeUndefined();
    });
  });

  describe('forEach', () => {
    describe('when Left', () => {
      it('should do nothing', () => {
        const original = Left(42);
        const callback = jest.fn();

        original.forEach(callback);

        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('when Right', () => {
      it('should invoke the callback with the right value', () => {
        const original = Right(42);
        const callback = jest.fn();

        original.forEach(callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(42);
      });
    });
  });

  describe('forEachLeft', () => {
    describe('when Left', () => {
      it('should invoke the callback with the right value', () => {
        const original = Left(42);
        const callback = jest.fn();

        original.forEachLeft(callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(42);
      });
    });

    describe('when Right', () => {
      it('should do nothing', () => {
        const original = Right(42);
        const callback = jest.fn();

        original.forEachLeft(callback);

        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('apply', () => {
    describe('when Left', () => {
      it('should return the original', () => {
        const value = Left<number, number>(42);
        const func = Right<number, Func<[number], string>>((val: number) =>
          val.toString()
        );
        const result = value.apply(func);

        expect(result).toBe(value);
      });
    });

    describe('when Right', () => {
      it('should return the mapped value', () => {
        const value = Right<number, number>(42);
        const func = Right<number, Func<[number], string>>((val: number) =>
          val.toString()
        );
        const result = value.apply(func);

        expect(result).not.toBe(value);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.right()).toBe('42');
      });
    });
  });

  describe('applyTo', () => {
    describe('when Left', () => {
      it('should return the original', () => {
        const func = Right<number, Func<[number], string>>((val: number) =>
          val.toString()
        );
        const value = Left<number, number>(42);
        const result = func.applyTo(value);

        expect(result).toBe(value);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect(result.left()).toBe(42);
        expect(result.right()).toBeUndefined();
      });
    });

    describe('when Right', () => {
      it('should return the mapped value', () => {
        const func = Right<number, Func<[number], string>>((val: number) =>
          val.toString()
        );
        const value = Right<number, number>(42);
        const result = func.applyTo(value);

        expect(result).not.toBe(value);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect(result.left()).toBeUndefined();
        expect(result.right()).toBe('42');
      });
    });
  });

  describe('fold', () => {
    describe('when Left', () => {
      it('should return the mapped left value', () => {
        const original = Left(42);
        const result = original.fold(
          () => 'left',
          () => 'right'
        );

        expect(result).toBe('left');
      });
    });

    describe('when Right', () => {
      it('should return the mapped right value', () => {
        const original = Right(42);
        const result = original.fold(
          () => 'left',
          () => 'right'
        );

        expect(result).toBe('right');
      });
    });
  });
});

describe('tryToEither', () => {
  describe('when returns a result', () => {
    it('should return a Right containing a result', () => {
      const fn = jest.fn(() => 42);
      const result = tryToEither(fn);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();

      expect(result.isLeft).toBe(false);
      expect(result.isRight).toBe(true);
      expect(result.left()).toBeUndefined();
      expect(result.right()).toBe(42);
    });
  });

  describe('when throws an error', () => {
    it('should return a Left containing an error', () => {
      const fn = jest.fn(() => {
        throw new Error('Oops');
      });
      const result = tryToEither(fn);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();

      expect(result.isLeft).toBe(true);
      expect(result.isRight).toBe(false);
      expect(result.left()).toEqual(new Error('Oops'));
      expect(result.right()).toBeUndefined();
    });
  });
});

describe('promiseToEither', () => {
  describe('when returns a result', () => {
    it('should return a Promise with Right containing a result', async () => {
      const promise = Promise.resolve(42);
      const result = await promiseToEither(promise);

      expect(result.isLeft).toBe(false);
      expect(result.isRight).toBe(true);
      expect(result.left()).toBeUndefined();
      expect(result.right()).toBe(42);
    });
  });

  describe('when throws an error', () => {
    it('should return a Promise with Left containing an error', async () => {
      const promise = Promise.reject(new Error('Oops'));
      const result = await promiseToEither(promise);

      expect(result.isLeft).toBe(true);
      expect(result.isRight).toBe(false);
      expect(result.left()).toEqual(new Error('Oops'));
      expect(result.right()).toBeUndefined();
    });
  });
});
