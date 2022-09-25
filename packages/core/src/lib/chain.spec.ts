import { Middleware, chain, Next } from './chain';

type Method = 'GET' | 'POST' | 'PUT';
type Path = string;
type Endpoint = `${Method} ${Path}`;

interface Request<T = unknown> {
  readonly method: Method;
  readonly path: Path;
  readonly body?: T;
  readonly [key: string]: unknown;
}

interface Response<T = unknown> {
  readonly status: number;
  readonly content: T;
}

type RequestHandler<TBody = unknown, TContent = unknown> = Middleware<
  Request<TBody>,
  Promise<Response<TContent>>
>;

type Route = {
  readonly method: Method;
  readonly path: Path;
  readonly handler: RequestHandler;
};

function useBodyParser(): RequestHandler {
  return (request, next) => {
    return next({
      ...request,
      body: JSON.parse(request.body as string),
    });
  };
}

export function on(endpoint: Endpoint, handler: RequestHandler): Route {
  const [method, path] = endpoint.split(' ') as [Method, Path];

  return { method, path, handler };
}

function useRouter(...routes: readonly Route[]): RequestHandler {
  return (request, next) => {
    for (const route of routes) {
      if (route.method === request.method && route.path === request.path) {
        return route.handler(request, next);
      }
    }

    return next(request);
  };
}

function useLogger(log: (req: Request) => void): RequestHandler {
  return (req, next) => {
    log(req);

    return next(req);
  };
}

function useDefaultResponse(): RequestHandler {
  return async () => ({
    status: 404,
    content: {
      error: 'Not found',
    },
  });
}

const pong: RequestHandler = async (request) => {
  return {
    status: 200,
    content: request.body,
  };
};

describe('chain', () => {
  let app: Next<Request, Promise<Response>>;
  let log: jest.Mock;

  beforeEach(() => {
    log = jest.fn();
    app = chain(
      useBodyParser(),
      useRouter(
        on('GET /ping', chain(useLogger(log), pong)),
        on('GET /pong', chain(useLogger(log), pong))
      ),
      useDefaultResponse()
    );
  });

  it('should pass the value through all middlewares', async () => {
    await expect(
      app({
        method: 'GET',
        path: '/ping',
        body: JSON.stringify({ data: 123 }),
      })
    ).resolves.toEqual({
      status: 200,
      content: { data: 123 },
    });

    await expect(
      app({
        method: 'GET',
        path: '/unknown',
        body: JSON.stringify({ data: 123 }),
      })
    ).resolves.toEqual({
      status: 404,
      content: { error: 'Not found' },
    });

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith({
      method: 'GET',
      path: '/ping',
      body: { data: 123 },
    });
  });
});
