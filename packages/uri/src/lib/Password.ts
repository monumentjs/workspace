export type Password = string;

export function parsePassword(source: string): Password {
  return validate(decodeURIComponent(source));
}

export function serializePassword(password: Password): string {
  return encodeURIComponent(validate(password));
}

function validate(password: Password): Password {
  if (password.length === 0) {
    throw new URIError('Password cannot be empty');
  }

  return password;
}
