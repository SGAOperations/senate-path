import { Body, Controller, Post, Get, Put, Param, BadRequestException } from '@nestjs/common';

import { NominationsService } from './nominations.service';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';

@Controller('/nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Get()
  getNominations() {
    return this.nominationsService.getNominations();
  }

  @Get('/:name')
  async getNominationsByName(@Param('name') name: string) {
    return this.nominationsService.getNominationsByName(name);
  }

  @Get('/:nuid')
  async getNominationsByNuid(@Param('nuid') nuid: string) {
    return this.nominationsService.getNominationsByNuid(nuid);
  }

  // TODO change this endpoint to getNominationsById instead of email
  @Get('/:email')
  getNominationsByEmail(@Param('email') email: string) {
    return this.nominationsService.getNominationsByEmail(email);
  }

  @Post()
  createNomination(@Body() request: CreateNominationRequestDto) {
    return this.nominationsService.createNomination(request);
  }

  @Put('/:id')
  updateNomination(
    @Param('id') id: number,
    @Body() request: UpdateNominationRequestDto
  ) {
    return this.nominationsService.updateNomination({
      id,
      ...request,
    });
  }
}
