import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateParticipationDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;
}
