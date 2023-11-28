import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'user@email.com' })
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please Enter a Valid Email' })
  email: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50, { message: 'Password length must be between 6 and 50 charachters' })
  password: string;
}
