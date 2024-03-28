import { IsString } from 'class-validator';
import { CreateNominationRequestDto } from './create-nomination-request.dto';
export class UpdateNominationRequestDto extends CreateNominationRequestDto{
  @IsString()
  status: string;
}
