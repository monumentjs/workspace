import { Complete, Failed, Initial, Pending, TaskStateFold } from './TaskState';

describe('TaskState', () => {
  describe('map', () => {
    describe('when Initial', () => {
      it('should return new Initial', () => {
        const source = Initial();
        const result = source.map(() => 123);

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Initial());
      });
    });

    describe('when Pending', () => {
      it('should return new Pending', () => {
        const source = Pending();
        const result = source.map(() => 123);

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Pending());
      });
    });

    describe('when Complete', () => {
      it('should return new Complete', () => {
        const source = Complete(1);
        const result = source.map(() => 123);

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Complete(123));
      });
    });

    describe('when Failed', () => {
      it('should return new Failed', () => {
        const source = Failed({ message: 'Error' });
        const result = source.map(() => 123);

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Failed({ message: 'Error' }));
      });
    });
  });

  describe('flatMap', () => {
    describe('when Initial', () => {
      it('should return a new Initial', () => {
        const source = Initial();
        const result = source.flatMap(() => Complete(123));

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Initial());
      });
    });

    describe('when Pending', () => {
      it('should return a new Pending', () => {
        const source = Pending();
        const result = source.flatMap(() => Complete(123));

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Pending());
      });
    });

    describe('when Complete', () => {
      it('should return a projected TaskState', () => {
        const source = Complete(1);
        const result = source.flatMap(() => Initial());

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Initial());
      });
    });

    describe('when Failed', () => {
      it('should return a new Failed', () => {
        const source = Failed({ message: 'Error' });
        const result = source.flatMap(() => Initial());

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Failed({ message: 'Error' }));
      });
    });
  });

  describe('catchMap', () => {
    describe('when Initial', () => {
      it('should return a new Initial', () => {
        const source = Initial<Error, number>();
        const result = source.catchMap(() => Complete(123));

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Initial());
      });
    });

    describe('when Pending', () => {
      it('should return a new Pending', () => {
        const source = Pending<Error, number>();
        const result = source.catchMap(() => Complete(123));

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Pending());
      });
    });

    describe('when Complete', () => {
      it('should return a projected TaskState', () => {
        const source = Complete(1);
        const result = source.catchMap(() => Initial());

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Complete(1));
      });
    });

    describe('when Failed', () => {
      it('should return a new Failed', () => {
        const source = Failed({ message: 'Error' });
        const result = source.catchMap(() => Initial());

        expect(result).not.toBe(source);

        expect(result).toStrictEqual(Initial());
      });
    });
  });

  describe('forEach', () => {
    describe('when Initial', () => {
      it('should not call a forEach', () => {
        const source = Initial();
        const forEach = jest.fn();
        const result = source.forEach(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });

    describe('when Pending', () => {
      it('should not call a forEach', () => {
        const source = Pending();
        const forEach = jest.fn();
        const result = source.forEach(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });

    describe('when Complete', () => {
      it('should call a forEach with a value', () => {
        const value = '123';
        const source = Complete(value);
        const forEach = jest.fn();
        const result = source.forEach(forEach);

        expect(result).toBe(source);

        expect(forEach).toHaveBeenCalledTimes(1);
        expect(forEach).toHaveBeenCalledWith(value);
      });
    });

    describe('when Failed', () => {
      it('should not call a forEach', () => {
        const source = Failed({ message: 'Error' });
        const forEach = jest.fn();
        const result = source.forEach(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });
  });

  describe('forEachError', () => {
    describe('when Initial', () => {
      it('should not call a forEach', () => {
        const source = Initial();
        const forEach = jest.fn();
        const result = source.forEachError(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });

    describe('when Pending', () => {
      it('should not call a forEach', () => {
        const source = Pending();
        const forEach = jest.fn();
        const result = source.forEachError(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });

    describe('when Complete', () => {
      it('should call a forEach with a value', () => {
        const source = Complete(1);
        const forEach = jest.fn();
        const result = source.forEachError(forEach);

        expect(result).toBe(source);

        expect(forEach).not.toHaveBeenCalled();
      });
    });

    describe('when Failed', () => {
      it('should not call a forEach', () => {
        const error = { message: 'Error' };
        const source = Failed(error);
        const forEach = jest.fn();
        const result = source.forEachError(forEach);

        expect(result).toBe(source);

        expect(forEach).toHaveBeenCalledTimes(1);
        expect(forEach).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('fold', () => {
    function makeFold(): TaskStateFold<unknown, unknown, string> {
      return {
        onInitial: jest.fn(() => 'initial'),
        onPending: jest.fn(() => 'pending'),
        onComplete: jest.fn(() => 'complete'),
        onFailed: jest.fn(() => 'failed'),
      };
    }

    describe('when Initial', () => {
      it('should invoke onInitial forEach', () => {
        const fold = makeFold();
        const source = Initial();
        const result = source.fold(fold);

        expect(result).toBe('initial');

        expect(fold.onInitial).toHaveBeenCalledTimes(1);
        expect(fold.onPending).not.toHaveBeenCalled();
        expect(fold.onComplete).not.toHaveBeenCalled();
        expect(fold.onFailed).not.toHaveBeenCalled();
      });
    });

    describe('when Pending', () => {
      it('should invoke onPending forEach', () => {
        const fold = makeFold();
        const source = Pending();
        const result = source.fold(fold);

        expect(result).toBe('pending');

        expect(fold.onInitial).not.toHaveBeenCalled();
        expect(fold.onPending).toHaveBeenCalledTimes(1);
        expect(fold.onComplete).not.toHaveBeenCalled();
        expect(fold.onFailed).not.toHaveBeenCalled();
      });
    });

    describe('when Complete', () => {
      it('should invoke onInitial forEach', () => {
        const fold = makeFold();
        const value = 123;
        const source = Complete(value);
        const result = source.fold(fold);

        expect(result).toBe('complete');

        expect(fold.onInitial).not.toHaveBeenCalled();
        expect(fold.onPending).not.toHaveBeenCalled();
        expect(fold.onComplete).toHaveBeenCalledTimes(1);
        expect(fold.onComplete).toHaveBeenCalledWith(value);
        expect(fold.onFailed).not.toHaveBeenCalled();
      });
    });

    describe('when Failed', () => {
      it('should invoke onError forEach', () => {
        const fold = makeFold();
        const error = { message: 'Error' };
        const source = Failed(error);
        const result = source.fold(fold);

        expect(result).toBe('failed');

        expect(fold.onInitial).not.toHaveBeenCalled();
        expect(fold.onPending).not.toHaveBeenCalled();
        expect(fold.onComplete).not.toHaveBeenCalled();
        expect(fold.onFailed).toHaveBeenCalledTimes(1);
        expect(fold.onFailed).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('chaining', () => {
    class TestError {
      constructor(readonly message: string) {}
    }

    class TestResult<T> {
      constructor(readonly data: T) {}
    }

    it('should produce correct type and result', () => {
      const getResult = jest.fn((result: TestResult<number>) => result.data);
      const forEach = jest.fn<void, [number]>();
      const flatMap = jest.fn((result: number) =>
        Failed(new TestError(`Bad result: ${result}`))
      );
      const state = Complete(new TestResult(123))
        .map(getResult)
        .forEach(forEach)
        .flatMap(flatMap);

      expect(state).toStrictEqual(new TestError('Bad result: 123'));

      expect(getResult).toHaveBeenCalledWith(new TestResult(123));
      expect(forEach).toHaveBeenCalledWith(123);
      expect(flatMap).toHaveBeenCalledWith(123);
    });
  });
});
