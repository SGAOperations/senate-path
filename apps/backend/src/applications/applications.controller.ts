import { Body, Controller, Post, Get } from '@nestjs/common';

import { ApplicationsService } from './applications.service';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';

@Controller('/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  getApplications() {
    return this.applicationsService.getApplications();
  }

  @Post()
  createApplication(@Body() request: CreateApplicationRequestDto) {
    return this.applicationsService.createApplication({
      fullName: request.fullName,
      preferredFullName: request.preferredFullName,
      phoneticPronunciation: request.phoneticPronunciation,
      nickname: request.nickname,
      nuid: request.nuid,
      pronouns: request.pronouns,
      email: request.email,
      phoneNumber: request.phoneNumber,
      year: request.year,
      college: request.college,
      major: request.major,
      minors: request.minors,
      constituency: request.constituency,
    });
  }
}
