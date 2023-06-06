import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtUtils } from '../jwt/jwt.utils';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private jwtUtil: JwtUtils) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new BadRequestException('token이 필요합니다.');
    }

    const payload = await this.jwtUtil.verifyAccessToken(accessToken);
    request['user'] = {
      userPk: Number.parseInt(payload.sub),
    };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
