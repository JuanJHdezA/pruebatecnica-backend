import { CorsLoggerMiddleware } from './cors-logger.middleware';

describe('CorsLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new CorsLoggerMiddleware()).toBeDefined();
  });
});
