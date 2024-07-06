import { promises as dns } from 'dns';

export async function findIpByUrl(hostname: string): Promise<string[]> {
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    return addresses.map((address) => address.address);
  } catch (error) {
    console.error('Error during DNS lookup:', error);
    throw error;
  }
}
