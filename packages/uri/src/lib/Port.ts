export type Port = number;

export const PORT_MIN = 1;
export const PORT_MAX = 2 ** 16;

export function createPort(port: number): Port {
  return validate(port);
}

export function parsePort(port: string): Port {
  return validate(parseInt(port));
}

export function serializePort(port: Port): string {
  return validate(port).toString();
}

function validate(port: Port): Port {
  if (isNaN(port) || !isFinite(port) || port < PORT_MIN || port > PORT_MAX) {
    throw new URIError(
      `Port number must be a number in range between ${PORT_MIN} and ${PORT_MAX}`,
    );
  }

  return port;
}
