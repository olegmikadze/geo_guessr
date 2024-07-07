import { AuthGuard } from '@nestjs/passport';
import { REFRESH_JWT_STRATEGY } from 'utils/constants';

export class RefreshGuard extends AuthGuard(REFRESH_JWT_STRATEGY) {
  constructor() {
    super();
  }
}
