import { Injectable } from '@nestjs/common';

import supabase from '../supabase/client';
import { Tables } from '../supabase/database.types';

@Injectable()
export class UsersService {
  async getUsers(): Promise<Tables<'users'>[]> {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createUser({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }): Promise<void> {
    const { error } = await supabase.from('users').insert({
      firstName,
      lastName,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
