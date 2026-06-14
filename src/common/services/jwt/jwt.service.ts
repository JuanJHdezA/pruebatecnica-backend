import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environments } from '../../../environments/environment';

/**
 *
 */
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  /**
   *
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environments.jwtConfig.api.secret 
    });
  }

  /**
   *
   * @param payload
   */
  async validate(payload: any) {
    // Aquí puedes buscar el usuario en la BD si es necesario
    return { userId: payload.sub, username: payload.username };
  }
}
