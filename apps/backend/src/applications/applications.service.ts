import { Injectable } from '@nestjs/common';

import supabase from '../supabase/client';

@Injectable()
export class ApplicationsService {
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
