import { Host, parseHost } from './Host';
import { parsePassword, Password } from './Password';
import { parsePort, Port } from './Port';
import { parseUsername, Username } from './Username';

const PATTERN =
  /^((?<username>[^:@]+)(:(?<password>[^@]+))?@)?(?<host>[^:]+)(:(?<port>\d+))?$/;

/**
 * An authority component of the URI.
 * @see URI.authority
 */
export interface Authority {
  readonly host: Host;
  readonly port?: Port;
  readonly username?: Username;
  readonly password?: Password;
}

export function parseAuthority(authority: string): Authority {
  const components = PATTERN.exec(authority)?.groups;

  if (components) {
    const { host, port, username, password } = components;

    return validate({
      host: parseHost(host),
      port: port == null ? undefined : parsePort(port),
      username: username == null ? undefined : parseUsername(username),
      password: password == null ? undefined : parsePassword(password),
    });
  }

  throw new URIError('Invalid authority');
}

export function serializeAuthority(authority: Authority): string {
  const { host, port, username, password } = validate(authority);

  let result = '';

  if (username) {
    result += username;

    if (password) {
      result += ':';
      result += password;
    }

    result += '@';
  }

  result += host;

  if (port) {
    result += ':';
    result += port;
  }

  return result;
}

export function withHost(host: Host) {
  return (authority: Authority) => validate({ ...authority, host });
}

export function withPort(port: Port) {
  return (authority: Authority) => validate({ ...authority, port });
}

export function withoutPort(authority: Authority): Authority {
  return validate({ ...authority, port: undefined });
}

export function withUsername(username: Username) {
  return (authority: Authority) => validate({ ...authority, username });
}

export function withoutUsername(authority: Authority): Authority {
  return validate({ ...authority, username: undefined });
}

export function withPassword(password: Password) {
  return (authority: Authority) => validate({ ...authority, password });
}

export function withoutPassword(authority: Authority): Authority {
  return validate({ ...authority, password: undefined });
}

function validate(authority: Authority): Authority {
  if (!authority.username && authority.password) {
    throw new URIError('Username is required when the password is specified');
  }

  return authority;
}
