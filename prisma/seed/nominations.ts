import { PrismaClient, CommunityConstituency } from '@prisma/client'
import { FIRST_NAMES, LAST_NAMES, COLLEGES, MAJORS, randomItem } from './constants'

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'PENDING', 'APPROVED'] as const

export async function seedNominations(
  prisma: PrismaClient,
  constituencies: CommunityConstituency[]
) {
  const nominations = []

  for (let i = 0; i < 5; i++) {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    const nominatorFirst = randomItem(FIRST_NAMES)
    const nominatorLast = randomItem(LAST_NAMES)

    nominations.push({
      nominee: `${firstName} ${lastName}`,
      fullName: `${nominatorFirst} ${nominatorLast}`,
      email: `nominator${i + 1}@northeastern.edu`,
      college: randomItem(COLLEGES),
      major: randomItem(MAJORS),
      status: STATUSES[i],
      constituencyType: i % 2 === 0 ? 'academic' : 'community',
      communityConstituencyId: i % 2 === 1 && i < 4 ? constituencies[Math.floor(i / 2)].id : null,
    })
  }

  await prisma.nomination.createMany({
    data: nominations,
    skipDuplicates: true,
  })
}
