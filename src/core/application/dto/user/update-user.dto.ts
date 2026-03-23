import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
