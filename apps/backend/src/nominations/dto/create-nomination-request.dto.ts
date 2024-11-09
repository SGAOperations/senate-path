import { IsEmail, IsString, IsPositive, IsBoolean } from 'class-validator';

export class CreateNominationRequestDto {
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsString()
  nominee: string;
  @IsString()
  constituency: string;
  @IsString()
  college: string;
  @IsString()
  major: string;
  @IsPositive()
  graduationYear: number;
  @IsBoolean()
  receiveSenatorInfo: boolean;
}
