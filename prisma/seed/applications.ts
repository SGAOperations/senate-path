import { CommunityConstituency } from '@prisma/client'
import { db } from '@/lib/db'
import {
  FIRST_NAMES,
  LAST_NAMES,
  COLLEGES,
  MAJORS,
  MINORS,
  YEARS,
  SEMESTERS,
  CONSTITUENCIES,
  PRONOUNS,
  LONG_ANSWERS,
  randomItem,
  generateNUID,
  generateEmail,
  generatePhoneNumber,
} from '@/prisma/seed/constants'

export async function seedApplications(constituencies: CommunityConstituency[]) {
  const applications = []

  for (let i = 0; i < 5; i++) {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    const fullName = `${firstName} ${lastName}`

    applications.push({
      nuid: generateNUID(),
      fullName,
      preferredFullName: fullName,
      phoneticPronunciation: fullName,
      pronunciationAudioUrl: `https://example.com/audio/${i}.mp3`,
      pronouns: randomItem(PRONOUNS),
      email: generateEmail(firstName, lastName),
      phoneNumber: generatePhoneNumber(),
      college: randomItem(COLLEGES),
      major: randomItem(MAJORS),
      minors: randomItem(MINORS),
      year: randomItem(YEARS),
      semester: randomItem(SEMESTERS),
      constituency: randomItem(CONSTITUENCIES),
      communityConstituencyId: i < 3 ? constituencies[i].id : null,
      whySenateLongAnswer: randomItem(LONG_ANSWERS.whySenate),
      constituencyIssueLongAnswer: randomItem(LONG_ANSWERS.constituencyIssue),
      diversityEquityInclusionLongAnswer: randomItem(LONG_ANSWERS.diversityEquityInclusion),
      conflictSituationLongAnswer: randomItem(LONG_ANSWERS.conflictSituation),
      campaignBlurb: `Vote ${firstName} ${lastName} for Student Senate - Committed to representing your voice!`,
      nominationFormPdfUrl: `https://example.com/nominations/${i}.pdf`,
    })
  }

  await db.application.createMany({
    data: applications,
    skipDuplicates: true,
  })
}
