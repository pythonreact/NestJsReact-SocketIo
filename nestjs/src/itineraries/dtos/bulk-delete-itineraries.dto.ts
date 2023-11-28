import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BulkDeleteItinerariesDto {
  @ApiProperty({ required: true, example: "[\"1\",\"2\"]" }) //prettier-ignore
  @IsString()
  data: string;
}
