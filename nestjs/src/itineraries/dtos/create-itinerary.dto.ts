import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateItineraryDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  departure: string;

  @ApiProperty({ required: true })
  @IsString()
  stops: string;

  @ApiProperty({ required: true })
  @IsString()
  arrival: string;
}
