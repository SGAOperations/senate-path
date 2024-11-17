import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';

import supabase from '../supabase/client';
import { Tables } from '../supabase/database.types';
import { Status } from './nominations.types';
import { validateOrReject, ValidationError } from 'class-validator';

@Injectable()
export class NominationsService {
  async getNominations(): Promise<Tables<'nominations'>[]> {
    const { data, error } = await supabase.from('nominations').select('*');

    if (error) {
      throw new InternalServerErrorException(`Failed to fetch nominations: ${error.message}`);
    }

    return data;
  }

  async getNominationsByEmail(email: string): Promise<Tables<'nominations'>[]> {
    const { data, error } = await supabase
      .from('nominations')
      .select('*')
      .eq('email', email);

    if (error) {
      throw new InternalServerErrorException(`Failed to fetch nominations: ${error.message}`);
    }

    if (data.length === 0) {
      throw new BadRequestException(
        `Nominations with given email, ${email}, do not exist.`
      );
    }

    return data;
  }

  async createNomination({
    ...nominationsColumns
  }: CreateNominationRequestDto): Promise<void> {
    try {
      await validateOrReject(nominationsColumns);
    } catch (errors) {
      throw new BadRequestException(this.formatValidationErrors(errors));
    }
    if (nominationsColumns.fullName === nominationsColumns.nominee) {
      throw new BadRequestException('You cannot nominate yourself for Senator.');
    }

    let status = Status.APPROVED;
    const { data: nominationData } = await supabase
      .from('nominations')
      .select('*')
      .eq('email', nominationsColumns.email);

    // Has this nominator already nominated this nominee?
    const valid = nominationData.every(
      (nomination) => nomination.nominee !== nominationsColumns.nominee
    );
    if (!valid) {
      status = Status.DENIED;
      throw new BadRequestException(
        `This nominator has already nominated the nominee: ${nominationsColumns.nominee}.`
      );
    }

    const { error } = await supabase.from('nominations').insert({
      ...nominationsColumns,
      status,
    });

    if (error) {
      throw new BadRequestException(`Failed to create nomination: ${error.message}`);
    }
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map((err) => `${err.property}: ${Object.values(err.constraints).join(', ')}`)
      .join('; ');
  }

  async updateNomination({
    id,
    ...nominationColumns
  }: {
    id: number;
  } & UpdateNominationRequestDto): Promise<void> {
    const { data: nominationData } = await supabase
      .from('nominations')
      .select('*')
      .eq('id', id);

    if (nominationData.length === 0) {
      throw new NotFoundException(
        `Nominations with given id, ${id}, does not exist.`
      );
    }

    const { error } = await supabase
      .from('nominations')
      .update({
        ...nominationColumns,
      })
      .eq('id', id);

    if (error) {
      throw new InternalServerErrorException(`Failed to update nomination: ${error.message}`);
    }
  }
}
