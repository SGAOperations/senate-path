import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';

import supabase from '../supabase/client';
import { Tables } from '../supabase/database.types';

@Injectable()
export class NominationsService {
  async getNominations(): Promise<Tables<'nominations'>[]> {
    const { data, error } = await supabase.from('nominations').select('*');

    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
  
  async createNomination({
    ...nominationsColumns
  }: CreateNominationRequestDto): Promise<void> {
    const { error } = await supabase.from('nominations').insert({
     ...nominationsColumns
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateNomination({
    id,
    ...nominationColumns
  }: {
    id: number;
  } & UpdateNominationRequestDto): Promise<void> {

    const { data: nominationData } = await supabase.from('nominations').select('*').eq('id', id);
    if (nominationData.length === 0) {
      throw new BadRequestException(`Nominations with given id, ${id}, does not exist.`);
    }

    const { error } = await supabase.from('nominations').update({
      ...nominationColumns
    }).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
