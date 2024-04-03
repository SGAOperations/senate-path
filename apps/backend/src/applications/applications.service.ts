import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateApplicationRequestDto } from './dto/update-application-request.dto';

import supabase from '../supabase/client';
import { Tables } from '../supabase/database.types';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';

@Injectable()
export class ApplicationsService {
  async getApplications(): Promise<Tables<'applications'>[]> {
    const { data, error } = await supabase.from('applications').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createApplication(
    applicationColumns: CreateApplicationRequestDto
  ): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .insert(applicationColumns);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateApplication({
    id,
    ...applicationColumns
  }: {
    id: number;
  } & UpdateApplicationRequestDto): Promise<void> {
    const { data: applicationData } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id);

    if (applicationData.length === 0) {
      throw new BadRequestException(
        `Application with given id, ${id}, does not exist.`
      );
    }

    const { error } = await supabase
      .from('applications')
      .update(applicationColumns)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
