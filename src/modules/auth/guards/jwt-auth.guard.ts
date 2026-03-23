import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: any;
    }>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const authParts = authHeader.split(' ');
    if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const token = authParts[1];

    try {
      const payload = this.jwtTokenService.verifyToken(token);
      request.user = {
        id: payload.sub,
        ...payload,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
