import { Func } from '../Func';
import { Invalid, Valid } from './Validated';

describe('Valid', () => {
  describe('map', () => {
    it('should evaluate a new value', () => {
      const original = Valid(2);
      const result = original.map((v) => v + 2);

      expect(result.isValid).toBe(true);
      expect(result.isInvalid).toBe(false);

      expect(result.value).toBe(4);
      expect(result.errors).toEqual([]);
    });
  });

  describe('flatMap', () => {
    describe('when result is Valid', () => {
      it('should return the result of evaluation', () => {
        const original = Valid(2);
        const result = original.flatMap((v) => Valid(v + 2));

        expect(result.isValid).toBe(true);
        expect(result.isInvalid).toBe(false);

        expect(result.value).toBe(4);
        expect(result.errors).toEqual([]);
      });
    });

    describe('when result is Invalid', () => {
      it('should return the result of evaluation', () => {
        const original = Valid(2);
        const result = original.flatMap(() => Invalid(['Oops']));

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });
  });

  describe('catchMap', () => {
    it('should return the original', () => {
      const original = Valid(2);
      const result = original.catchMap(() => Valid(-1));

      expect(result.isValid).toBe(true);
      expect(result.isInvalid).toBe(false);

      expect(result.value).toBe(2);
      expect(result.errors).toEqual([]);
    });
  });

  describe('forEach', () => {
    it('should invoke the callback with the value', () => {
      const original = Valid(2);
      const callback = jest.fn();

      original.forEach(callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(2);
    });
  });

  describe('apply', () => {
    describe('when other is Valid', () => {
      it('should return a Valid with result of function evaluation on the value', () => {
        const original = Valid(2);
        const other = Valid((n: number) => n + 2);
        const result = original.apply(other);

        expect(result.isValid).toBe(true);
        expect(result.isInvalid).toBe(false);

        expect(result.value).toBe(4);
        expect(result.errors).toEqual([]);
      });
    });

    describe('when other is Invalid', () => {
      it('should return an Invalid with accumulated errors', () => {
        const original = Valid<string, number>(2);
        const other = Invalid<string, Func<[number], number>>(['Oops']);
        const result = original.apply(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });
  });

  describe('applyTo', () => {
    describe('when other is Valid', () => {
      it('should return a valid with result of function evaluation on the value', () => {
        const original = Valid((n: number) => n + 2);
        const other = Valid(2);
        const result = original.applyTo(other);

        expect(result.isValid).toBe(true);
        expect(result.isInvalid).toBe(false);

        expect(result.value).toBe(4);
        expect(result.errors).toEqual([]);
      });
    });

    describe('when other is Invalid', () => {
      it('should return an Invalid with accumulated errors', () => {
        const original = Valid((n: number) => n + 2);
        const other = Invalid<string, number>(['Oops']);
        const result = original.applyTo(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });
  });

  describe('fold', () => {
    it('should return the result of `onValid` delegate', () => {
      const original = Valid(2);
      const onValid = jest.fn(() => 'valid');
      const onInvalid = jest.fn(() => 'invalid');

      const result = original.fold(onValid, onInvalid);

      expect(result).toBe('valid');

      expect(onValid).toHaveBeenCalledTimes(1);
      expect(onValid).toBeCalledWith(2);

      expect(onInvalid).not.toHaveBeenCalled();
    });
  });
});

describe('Invalid', () => {
  describe('map', () => {
    it('should return the original', () => {
      const original = Invalid<string, number>(['Oops']);
      const result = original.map((v) => v + 2);

      expect(result.isValid).toBe(false);
      expect(result.isInvalid).toBe(true);

      expect(() => result.value).toThrow();
      expect(result.errors).toEqual(['Oops']);
    });
  });

  describe('flatMap', () => {
    describe('when result is Valid', () => {
      it('should return the original', () => {
        const original = Invalid<string, number>(['Oops']);
        const result = original.flatMap((v) => Valid(v + 2));

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });

    describe('when result is Invalid', () => {
      it('should return the original', () => {
        const original = Invalid<string, number>(['Oops']);
        const result = original.flatMap((v) => Valid(v + 2));

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });
  });

  describe('catchMap', () => {
    it('should return the result of delegate', () => {
      const original = Invalid<string, number>(['Oops']);
      const result = original.catchMap(() => Valid(-1));

      expect(result.isValid).toBe(true);
      expect(result.isInvalid).toBe(false);

      expect(result.value).toBe(-1);
      expect(result.errors).toEqual([]);
    });
  });

  describe('forEach', () => {
    it('should not invoke the callback', () => {
      const original = Invalid(['Oops']);
      const callback = jest.fn();

      original.forEach(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('apply', () => {
    describe('when other is Valid', () => {
      it('should return an Invalid with original errors', () => {
        const original = Invalid<string, number>(['Oops']);
        const other = Valid<string, Func<[number], number>>(
          (n: number) => n + 2
        );
        const result = original.apply(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });

    describe('when other is Invalid', () => {
      it('should return an Invalid with accumulated errors', () => {
        const original = Invalid<string, number>(['One']);
        const other = Invalid<string, Func<[number], number>>(['Two']);
        const result = original.apply(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['One', 'Two']);
      });
    });
  });

  describe('applyTo', () => {
    describe('when other is Valid', () => {
      it('should return a valid with result of function evaluation on the value', () => {
        const original = Invalid<string, Func<[number], number>>(['Oops']);
        const other = Valid<string, number>(2);
        const result = original.applyTo(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Oops']);
      });
    });

    describe('when other is Invalid', () => {
      it('should return an Invalid with accumulated errors', () => {
        const original = Invalid<string, Func<[number], number>>(['One']);
        const other = Invalid<string, number>(['Two']);
        const result = original.applyTo(other);

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);

        expect(() => result.value).toThrow();
        expect(result.errors).toEqual(['Two', 'One']);
      });
    });
  });

  describe('fold', () => {
    it('should return the result of `onValid` delegate', () => {
      const original = Invalid(['Oops']);
      const onValid = jest.fn(() => 'valid');
      const onInvalid = jest.fn(() => 'invalid');

      const result = original.fold(onValid, onInvalid);

      expect(result).toBe('invalid');

      expect(onValid).not.toHaveBeenCalled();

      expect(onInvalid).toHaveBeenCalledTimes(1);
      expect(onInvalid).toHaveBeenCalledWith(['Oops']);
    });
  });
});
