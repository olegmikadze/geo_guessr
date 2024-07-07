import { HttpException, HttpStatus } from '@nestjs/common';
import { promises as dns } from 'dns';

export async function findIpByUrl(hostname: string): Promise<string[]> {
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    return addresses.map((address) => address.address);
  } catch (error) {
    this.logger.log(error);
    throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
  }
}
