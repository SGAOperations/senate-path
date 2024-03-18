import { Injectable } from '@nestjs/common';

import supabase from '../supabase/client';
import { Tables } from '../supabase/database.types';

@Injectable()
export class ApplicationsService {
  async getApplications(): Promise<Tables<'applications'>[]> {
    const { data, error } = await supabase.from('applications').select('*');

    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
  
  async createApplication({
    fullName,
    preferredFullName,
    phoneticPronunciation,
    nickname,
    nuid,
    pronouns,
    email,
    phoneNumber,
    year,
    college,
    major,
    minors,
    constituency,
  }: {
    fullName: string;
    preferredFullName: string;
    phoneticPronunciation: string;
    nickname: string;
    nuid: string; 
    pronouns: string;
    email: string;
    phoneNumber: string;
    year: number;
    college: string;
    major: string;
    minors: string;
    constituency: string;
  }): Promise<void> {
    const { error } = await supabase.from('applications').insert({
      fullName,
      preferredFullName,
      phoneticPronunciation,
      nickname,
      nuid,
      pronouns,
      email,
      phoneNumber,
      year,
      college,
      major,
      minors,
      constituency,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
