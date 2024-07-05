import { JwtPayload } from './jwtPayload.type';

export type UserPayload = JwtPayload;

export type UserRefreshPayload = JwtPayload & { refreshToken: string };
