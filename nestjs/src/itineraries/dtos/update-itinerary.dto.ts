import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateItineraryDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  departure: string;

  @ApiProperty({ required: false })
  @IsString()
  stops: string;

  @ApiProperty({ required: false })
  @IsString()
  arrival: string;
}
