import { CommunityConstituency } from '@prisma/client'
import { db } from '../../lib/db'
import { 
  FIRST_NAMES, 
  LAST_NAMES, 
  COLLEGES, 
  MAJORS, 
  randomItem,
  generateEmail,
  getRandomConstituencyId,
} from './constants'

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'PENDING', 'APPROVED'] as const

export async function seedNominations(constituencies: CommunityConstituency[]) {
  const nominations = []

  for (let i = 0; i < 5; i++) {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    const nominatorFirst = randomItem(FIRST_NAMES)
    const nominatorLast = randomItem(LAST_NAMES)

    nominations.push({
      nominee: `${firstName} ${lastName}`,
      fullName: `${nominatorFirst} ${nominatorLast}`,
      email: generateEmail(nominatorFirst, nominatorLast),
      college: randomItem(COLLEGES),
      major: randomItem(MAJORS),
      status: STATUSES[i],
      constituencyType: i % 2 === 0 ? 'academic' : 'community',
      communityConstituencyId: getRandomConstituencyId(i, constituencies),
    })
  }

  await db.nomination.createMany({
    data: nominations,
    skipDuplicates: true,
  })
}
