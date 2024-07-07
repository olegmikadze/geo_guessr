import { JwtPayload } from './jwt-payload.type';

export type UserPayload = JwtPayload;

export type UserRefreshPayload = JwtPayload & { refreshToken: string };
