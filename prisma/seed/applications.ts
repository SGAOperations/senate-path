import { PrismaClient, CommunityConstituency } from '@prisma/client'
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
} from './constants'

export async function seedApplications(
  prisma: PrismaClient,
  constituencies: CommunityConstituency[]
) {
  const applications = []

  for (let i = 0; i < 5; i++) {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    const fullName = `${firstName} ${lastName}`

    applications.push({
      nuid: `00100000${i}`,
      fullName,
      preferredFullName: fullName,
      phoneticPronunciation: fullName,
      pronunciationAudioUrl: `https://example.com/audio/${i}.mp3`,
      pronouns: randomItem(PRONOUNS),
      email: `user${i + 1}@northeastern.edu`,
      phoneNumber: `617-555-010${i}`,
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

  await prisma.application.createMany({
    data: applications,
    skipDuplicates: true,
  })
}
