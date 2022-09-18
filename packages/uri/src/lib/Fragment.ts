export type Fragment = string;

export function parseFragment(source: string): Fragment {
  return validate(decodeURIComponent(source));
}

export function serializeFragment(fragment: Fragment): string {
  return encodeURIComponent(validate(fragment));
}

function validate(fragment: Fragment): Fragment {
  if (fragment.length === 0) {
    throw new URIError('Fragment cannot be empty');
  }

  return fragment;
}
