import { AuthPublicGuard } from './auth-public.guard';

describe('AuthPublicGuard', () => {
  it('should be defined', () => {
    expect(new AuthPublicGuard()).toBeDefined();
  });
});
