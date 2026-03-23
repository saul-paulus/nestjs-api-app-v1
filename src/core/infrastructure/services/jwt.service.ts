import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  [key: string]: unknown;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: { id: string; email: string }): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  decodeToken(token: string): JwtPayload | null {
    return this.jwtService.decode<JwtPayload>(token);
  }
}
