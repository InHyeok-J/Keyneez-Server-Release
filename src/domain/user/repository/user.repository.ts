import { Injectable } from '@nestjs/common';
import { OAuthUserTypeDto } from 'src/domain/auth/dto/oauth-user-type.dto';
import { PrismaService } from 'src/global/prisma/prima.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByOAuthUserType(oauthUser: OAuthUserTypeDto) {
    const { snsId, snsType } = oauthUser;
    return await this.prisma.users.findUnique({
      where: {
        sns_identifer: {
          sns_id: snsId,
          sns_type: snsType,
        },
      },
    });
  }

  async updateRefreshToken(userPk: number, refreshToken: string) {
    await this.prisma.users.update({
      where: {
        user_pk: userPk,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
  }
}
