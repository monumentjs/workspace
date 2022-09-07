import { IO } from './IO';

describe('IO', () => {
  describe('run', () => {
    it('should run the inner function', () => {
      const fn = jest.fn(() => 42);
      const io = IO(fn);

      expect(fn).not.toHaveBeenCalled();

      expect(io.run()).toBe(42);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('map', () => {
    it('should return the result of evaluation wrappen into IO', () => {
      const value = IO(() => 42);
      const result = value.map((v) => v * 2);

      expect(result.run()).toBe(84);
    });
  });

  describe('flatMap', () => {
    it('should return the result of evaluation', () => {
      const value = IO(() => 42);
      const result = value.flatMap((n) => IO(() => n.toString()));

      expect(result.run()).toBe('42');
    });
  });

  describe('apply', () => {
    it('should lazily apply the given function to the result of the own function result', () => {
      const value = IO(() => 42);
      const fn = jest.fn(() => (n: number) => n * 2);
      const func = IO(fn);
      const result = value.apply(func);

      expect(fn).not.toHaveBeenCalled();

      expect(result.run()).toBe(84);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();
    });
  });

  describe('applyTo', () => {
    it('should lazily apply the function to the result of the other function result', () => {
      const fn = jest.fn(() => (n: number) => n * 2);
      const func = IO(fn);
      const value = IO(() => 42);
      const result = func.applyTo(value);

      expect(fn).not.toHaveBeenCalled();

      expect(result.run()).toBe(84);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();
    });
  });
});
