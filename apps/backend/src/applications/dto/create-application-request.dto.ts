import { IsEmail } from 'class-validator';

export class CreateApplicationRequestDto {
  fullName: string;
  preferredFullName: string;
  phoneticPronunciation: string;
  nickname: string;
  nuid: string;
  pronouns: string;
  @IsEmail()
  email: string;
  phoneNumber: string;
  year: number;
  college: string;
  major: string;
  minors: string;
  constituency: string;
}
