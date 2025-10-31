import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateApplicationRequestDto } from './dto/update-application-request.dto';
import { GetNominationFormDTO } from './dto/get-nomination-forms-request.dto';

import { PrismaService } from '../prisma/prisma.service';
import { Application } from '@prisma/client';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';
import { validateOrReject, ValidationError } from 'class-validator';

import { NominationsService} from '../nominations/nominations.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nominationsService: NominationsService
  ) {}

  async getApplications(): Promise<Application[]> {
    return this.prisma.application.findMany();
  }

  async getNominationForms(): Promise<GetNominationFormDTO> {
    const nominees = await this.prisma.application.findMany({
      select: { fullName: true, email: true },
    });
    
    const constituencies = await this.prisma.application.findMany({
      select: { constituency: true },
      distinct: ['constituency'],
    });

    return {
      nominees: nominees,
      constituencies: constituencies.map((item) => item.constituency),
    };
  }

  /**
   * Creates an application on supabase sql table
   * @param applicationColumns are the columns returned by the application request dto
   */
  async createApplication(applicationColumns: CreateApplicationRequestDto): Promise<void> {
    await this.validateApplication(applicationColumns);
    await this.handleApplication(applicationColumns);
  }

  private async validateApplication(applicationColumns: CreateApplicationRequestDto): Promise<void> {
    try {
      await validateOrReject(applicationColumns);
      console.log('columns', applicationColumns);
    } catch (errors) {
      console.log("Validation failed");
      throw new BadRequestException(this.formatValidationErrors(errors));
    }
  }

  private async handleApplication(applicationColumns: CreateApplicationRequestDto): Promise<void> {
    const nuid = applicationColumns.nuid;
    const existingApplication = await this.prisma.application.findUnique({
      where: { nuid },
    });

    if (existingApplication) {
      // if application already exists
      await this.updateApplicationNUID(applicationColumns);
    } else {
      // new applications
      await this.insertApplication(applicationColumns);
    }
  }

  // insert application in sql
  private async insertApplication(applicationColumns: CreateApplicationRequestDto): Promise<void> {
    await this.prisma.application.create({
      data: applicationColumns,
    });
  }

  // update existing application
  private async updateApplicationNUID(applicationColumns: CreateApplicationRequestDto): Promise<void> {
    await this.prisma.application.update({
      where: { nuid: applicationColumns.nuid },
      data: applicationColumns,
    });

    // delete all nominations associated with the current application IF updated
    await this.nominationsService.deleteAllNominationsFor(applicationColumns.fullName);
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
    .map((err) => `${err.property}: ${Object.values(err.constraints).join(', ')}`)
    .join('; ');
  }

  async updateApplication({
                            id,
                            ...applicationColumns
                          }: {
    id: number;
  } & UpdateApplicationRequestDto): Promise<void> {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(
        `Application with given id, ${id}, does not exist.`
      );
    }

    await this.prisma.application.update({
      where: { id },
      data: applicationColumns,
    });
  }
}
