import { AIO } from './AIO';

describe('AIO', () => {
  describe('run', () => {
    it('should run the inner function', async () => {
      const fn = jest.fn(async () => 42);
      const io = AIO(fn);

      expect(fn).not.toHaveBeenCalled();

      await expect(io.run()).resolves.toBe(42);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('map', () => {
    it('should return the result of evaluation wrappen into AIO', async () => {
      const value = AIO(async () => 42);
      const result = value.map((v) => v * 2);

      await expect(result.run()).resolves.toBe(84);
    });
  });

  describe('flatMap', () => {
    it('should return the result of evaluation', async () => {
      const value = AIO(async () => 42);
      const result = value.flatMap((n) => AIO(async () => n.toString()));

      await expect(result.run()).resolves.toBe('42');
    });
  });

  describe('apply', () => {
    it('should lazily apply the given function to the result of the own function result', async () => {
      const value = AIO(async () => 42);
      const fn = jest.fn(async () => (n: number) => n * 2);
      const func = AIO(fn);
      const result = value.apply(func);

      expect(fn).not.toHaveBeenCalled();

      await expect(result.run()).resolves.toBe(84);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();
    });
  });

  describe('applyTo', () => {
    it('should lazily apply the function to the result of the other function result', async () => {
      const fn = jest.fn(async () => (n: number) => n * 2);
      const func = AIO(fn);
      const value = AIO(async () => 42);
      const result = func.applyTo(value);

      expect(fn).not.toHaveBeenCalled();

      await expect(result.run()).resolves.toBe(84);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith();
    });
  });

  describe('chaining', () => {
    it('should chain properly', async () => {
      const fetchData = () => AIO(() => Promise.resolve({ a: 1 }));
      const toJSON = (data: unknown) => JSON.stringify(data);
      const writeFile = (file: string) => (data: string) =>
        AIO(() => Promise.resolve(`${file}: ${data}`));

      const result = await fetchData()
        .map(toJSON)
        .flatMap(writeFile('data.json'))
        .run();

      expect(result).toBe('data.json: {"a":1}');
    });
  });
});
