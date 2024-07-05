import * as bcrypt from 'bcrypt';

export async function bcryptHash(string) {
  const passwordSalt = await bcrypt.genSalt();

  return await bcrypt.hash(string, passwordSalt);
}
