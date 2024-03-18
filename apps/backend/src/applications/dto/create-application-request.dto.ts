import {
  IsEmail,
  IsString,
  IsPositive,
} from 'class-validator';

export class CreateApplicationRequestDto {
  @IsString()
  fullName: string;
  @IsString()
  preferredFullName: string;
  @IsString()
  phoneticPronunciation: string;
  @IsString()
  nickname: string;
  @IsString()
  nuid: string;
  @IsString()
  pronouns: string;
  @IsEmail()
  email: string;
  @IsString()
  phoneNumber: string;
  @IsPositive()
  year: number;
  @IsString()
  college: string;
  @IsString()
  major: string;
  @IsString()
  minors: string;
  @IsString()
  constituency: string;
}
