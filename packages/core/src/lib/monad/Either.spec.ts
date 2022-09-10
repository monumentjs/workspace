import { Func } from '../Func';
import { Left, Right } from './Either';

describe('Either', () => {
  describe('map', () => {
    describe('when Left', () => {
      it('should return the original', () => {
        const original = Left('a');
        const result = original.map(() => 42);

        expect(result).toBe(original);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect([...result.left()]).toEqual(['a']);
        expect([...result.right()]).toEqual([]);
      });
    });

    describe('when Right', () => {
      it('should create a new Right with mapped value', () => {
        const original = Right('a');
        const result = original.map(() => 42);

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual([42]);
      });
    });
  });

  describe('leftMap', () => {
    describe('when Left', () => {
      it('should create a new Left with mapped value', () => {
        const original = Left('a');
        const result = original.leftMap(() => 42);

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(true);
        expect(result.isRight).toBe(false);

        expect([...result.left()]).toEqual([42]);
        expect([...result.right()]).toEqual([]);
      });
    });

    describe('when Right', () => {
      it('should return the original', () => {
        const original = Right('a');
        const result = original.leftMap(() => 42);

        expect(result).toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual(['a']);
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

        expect([...result.left()]).toEqual(['a']);
        expect([...result.right()]).toEqual([]);
      });
    });

    describe('when Right', () => {
      it('should return the calculated value', () => {
        const original = Right('a');
        const result = original.flatMap(() => Right(42));

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual([42]);
      });
    });
  });

  describe('catchMap', () => {
    describe('when Left', () => {
      it('should return the calculated value', () => {
        const original = Left('a');
        const result = original.catchMap(() => Right(42));

        expect(result).not.toBe(original);

        expect(result.isLeft).toBe(false);
        expect(result.isRight).toBe(true);

        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual([42]);
      });
    });
  });

  describe('when Right', () => {
    it('should return the original', () => {
      const original = Right('a');
      const result = original.catchMap(() => Right('b'));

      expect(result).toBe(original);

      expect(result.isLeft).toBe(false);
      expect(result.isRight).toBe(true);

      expect([...result.left()]).toEqual([]);
      expect([...result.right()]).toEqual(['a']);
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

        expect([...result.left()]).toEqual(['left']);
      });
    });

    describe('when Right', () => {
      it('should return the mapped right value', () => {
        const original = Right(42);
        const result = original.bimap(
          () => 'left',
          () => 'right'
        );

        expect([...result.right()]).toEqual(['right']);
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
        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual([42]);
      });
    });
  });

  describe('when Right', () => {
    it('should return Left with the same value', () => {
      const original = Right(42);
      const result = original.swap();

      expect(result.isLeft).toBe(true);
      expect(result.isRight).toBe(false);
      expect([...result.left()]).toEqual([42]);
      expect([...result.right()]).toEqual([]);
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

        expect([...result.right()]).toEqual(['42']);
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

        expect([...result.left()]).toEqual([42]);
        expect([...result.right()]).toEqual([]);
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

        expect([...result.left()]).toEqual([]);
        expect([...result.right()]).toEqual(['42']);
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
