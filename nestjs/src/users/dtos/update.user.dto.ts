import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'user@email.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, example: 'password' })
  @IsString()
  @IsOptional()
  password: string;
}
