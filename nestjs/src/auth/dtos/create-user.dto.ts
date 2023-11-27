import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please Enter a Valid Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50, { message: 'Password length must be between 6 and 50 charachters' })
  password: string;
}
