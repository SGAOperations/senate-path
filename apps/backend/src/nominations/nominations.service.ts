import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';

import { PrismaService } from '../prisma/prisma.service';
import { Nomination } from '@prisma/client';
import { Status } from './nominations.types';
import { validateOrReject, ValidationError } from 'class-validator';

interface NomineeData {
  constituencyName: string;
}

@Injectable()
export class NominationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNominations(): Promise<Nomination[]> {
    return this.prisma.nomination.findMany();
  }

  async getNominationsByName(name: string): Promise<number> {
    console.log('name:' + name);
    const count = await this.prisma.nomination.count({
      where: {
        nominee: name,
        status: Status.APPROVED,
      },
    });
    console.log('count', count);
    return count;
  }

  private async getNameByNuid(nuid: string): Promise<string> {
    const application = await this.prisma.application.findUnique({
      where: { nuid },
      select: { fullName: true },
    });

    if (!application) {
      throw new NotFoundException(`No application found for NUID ${nuid}`);
    }

    return application.fullName;
  }

  async getNominationsByNuid(nuid: string): Promise<number> {
    console.log('nuid' + nuid);
    const name = await this.getNameByNuid(nuid);
    const count = await this.getNominationsByName(name);
    console.log('final count', count);
    return count;
  }

  async getNominationsByEmail(email: string): Promise<Nomination[]> {
    const nominations = await this.prisma.nomination.findMany({
      where: { email },
    });

    if (nominations.length === 0) {
      throw new BadRequestException(
        `Nominations with given email, ${email}, do not exist.`
      );
    }

    return nominations;
  }

  async createNomination({
    ...nominationsColumns
  }: CreateNominationRequestDto): Promise<void> {
    try {
      console.log('here');
      await validateOrReject(nominationsColumns);
    } catch (errors) {
      console.log(errors);
      throw new BadRequestException(this.formatValidationErrors(errors));
    }

    if (nominationsColumns.fullName === nominationsColumns.nominee) {
      throw new BadRequestException(
        'You cannot nominate yourself for Senator.'
      );
    }

    // **Constituency Validation**: New helper function call
    await this.validateConstituency(
      nominationsColumns.nominee,
      nominationsColumns.constituency
    );

    console.log('hereee');
    let status = Status.APPROVED;
    const nominationData = await this.prisma.nomination.findMany({
      where: { email: nominationsColumns.email },
    });

    // Has this nominator already nominated this nominee?
    const valid = nominationData.every(
      (nomination) => nomination.nominee !== nominationsColumns.nominee
    );
    if (!valid) {
      status = Status.DENIED;
      console.log('what');
      throw new BadRequestException(
        `This nominator has already nominated the nominee: ${nominationsColumns.nominee}.`
      );
    }

    await this.prisma.nomination.create({
      data: {
        ...nominationsColumns,
        status,
      },
    });
  }

  private async validateConstituency(
    nominee: string,
    constituency: string
  ): Promise<void> {
    const nomineeData = await this.prisma.application.findFirst({
      where: { fullName: nominee },
      select: { constituency: true },
    });

    if (!nomineeData) {
      throw new NotFoundException(`Nominee ${nominee} not found.`);
    }
    console.log(nomineeData);
    if (nomineeData.constituency !== constituency) {
      console.log(nomineeData.constituency);
      console.log(constituency);
      console.log(nomineeData.constituency !== constituency);
      throw new BadRequestException(
        `The nominator must belong to the same constituency as the nominee.`
      );
    }
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map(
        (err) => `${err.property}: ${Object.values(err.constraints).join(', ')}`
      )
      .join('; ');
  }

  async updateNomination({
    id,
    ...nominationColumns
  }: {
    id: number;
  } & UpdateNominationRequestDto): Promise<void> {
    const nomination = await this.prisma.nomination.findUnique({
      where: { id },
    });

    if (!nomination) {
      throw new NotFoundException(
        `Nominations with given id, ${id}, does not exist.`
      );
    }

    await this.prisma.nomination.update({
      where: { id },
      data: nominationColumns,
    });
  }

  async getUniqueNominees() {
    const applicants = await this.prisma.application.findMany({
      select: { id: true, fullName: true },
      orderBy: { id: 'desc' },
    });

    const uniqueNominees = new Map<string, { id: number; fullName: string }>();

    for (const applicant of applicants) {
      if (!uniqueNominees.has(applicant.fullName)) {
        uniqueNominees.set(applicant.fullName, applicant);
      }
    }

    return Array.from(uniqueNominees.values()).map(
      (applicant) => applicant.fullName
    );
  }

  /**
   * delete all nominations based on the name of the nominee
   * @param nominee name
   */
  async deleteAllNominationsFor(nominee: string): Promise<void> {
    Logger.log('deleted nominations associated with updated applicant');
    await this.prisma.nomination.deleteMany({
      where: { nominee },
    });
  }

  async getNomineesWithVotes(votes: number) {
    // Step 1: Fetch nominee counts and constituency
    const data = await this.prisma.nomination.findMany({
      select: { nominee: true, constituency: true },
    });

    if (!data || data.length === 0) {
      console.log('No data found');
      return [];
    }

    // Step 2: Count occurrences of each nominee
    const nomineeCounts: Record<
      string,
      { count: number; constituency: string }
    > = {};
    data.forEach(({ nominee, constituency }) => {
      if (!nomineeCounts[nominee]) {
        nomineeCounts[nominee] = { count: 0, constituency };
      }
      nomineeCounts[nominee].count += 1;
    });

    // Step 3: Filter nominees with votes greater than the threshold and sort results
    const finalResult = Object.entries(nomineeCounts)
      .filter(([_, { count }]) => count >= votes)
      .map(([nominee, { count, constituency }]) => ({
        nominee,
        constituency,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by highest to lowest count
    console.log(finalResult);
    return finalResult;
  }
}
