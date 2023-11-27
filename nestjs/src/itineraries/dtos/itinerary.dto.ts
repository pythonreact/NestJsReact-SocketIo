import { Expose, Transform } from 'class-transformer';

export class ItineraryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  departure: string;

  @Expose()
  stops: string;

  @Expose()
  arrival: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
