/**
 * Represents a decoded username component of the URI.
 */
export type Username = string;

export function parseUsername(source: string): Username {
  return validate(decodeURIComponent(source));
}

export function serializeUsername(username: Username): string {
  return encodeURIComponent(validate(username));
}

function validate(value: string): Username {
  if (value.length === 0) {
    throw new URIError('Username cannot be empty');
  }

  return value;
}
