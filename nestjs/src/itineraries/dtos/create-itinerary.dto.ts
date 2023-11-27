import { IsString } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  name: string;

  @IsString()
  departure: string;

  @IsString()
  stops: string;

  @IsString()
  arrival: string;
}
