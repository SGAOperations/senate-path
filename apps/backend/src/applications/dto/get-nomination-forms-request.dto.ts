import { IsArray, IsString } from 'class-validator'

export class GetNominationFormDTO {
  @IsArray()
  nominees: Array<{
    fullName: string
    email: string
  }>
  @IsArray()
  constituencies: Array<string>
}