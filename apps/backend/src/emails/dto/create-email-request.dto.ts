import { IsEmail, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateEmailRequestDto {
  @IsArray()
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  recipients: string[];
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsString()
  subject: string;
}
