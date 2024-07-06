import { ipv4Pattern, urlPattern, ipv6Pattern } from './constants';

export function findAddressPattern({
  address,
}: {
  address: string;
}): 'url' | 'ip' | null {
  const patterns = [
    { type: 'URL', regex: urlPattern },
    { type: 'IPv4', regex: ipv4Pattern },
    { type: 'IPv6', regex: ipv6Pattern },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(address)) {
      return pattern.type === 'URL' ? 'url' : 'ip';
    }
  }

  return null;
}
