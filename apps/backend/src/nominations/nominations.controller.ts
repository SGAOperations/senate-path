import { Body, Controller, Post, Get, Put, Param } from '@nestjs/common';

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

  @Get('/:email')
  getNominationsByEmail(@Param('email') email: string) {
    return this.nominationsService.getNominationsByEmail(email);
  }

  @Post()
  createNomination(@Body() request: CreateNominationRequestDto) {
    return this.nominationsService.createNomination(request);
  }

  @Put('/:id')
  updateApplication(
    @Param('id') id: number,
    @Body() request: UpdateNominationRequestDto
  ) {
    return this.nominationsService.updateNomination({
      id,
      ...request,
    });
  }
}
