import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({ example: 'uuid-string' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'johndoe', required: false })
  username?: string;

  @ApiProperty({ example: 'tenant-uuid' })
  tenant_id!: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  created_at!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updated_at!: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserDataDto })
  user_data!: UserDataDto;

  @ApiProperty({ example: 'jwt.token.string' })
  access_token!: string;
}
