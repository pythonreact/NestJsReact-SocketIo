import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BulkCreateItinerariesDto {
  @ApiProperty({ required: true, example: '5' })
  @IsString()
  number: string;
}
