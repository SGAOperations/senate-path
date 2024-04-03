import { IsString } from 'class-validator';
import { CreateNominationRequestDto } from './create-nomination-request.dto';
import { STATUS } from '../nominations.types';
export class UpdateNominationRequestDto extends CreateNominationRequestDto{
  @IsString()
  status: STATUS;
}
