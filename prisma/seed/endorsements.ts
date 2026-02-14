import { PrismaClient } from '@prisma/client'
import { FIRST_NAMES, LAST_NAMES, ENDORSEMENT_CONTENT, randomItem } from './constants'

export async function seedEndorsements(prisma: PrismaClient) {
  const endorsements = []

  for (let i = 0; i < 5; i++) {
    const endorserFirst = randomItem(FIRST_NAMES)
    const endorserLast = randomItem(LAST_NAMES)
    const applicantFirst = randomItem(FIRST_NAMES)
    const applicantLast = randomItem(LAST_NAMES)

    endorsements.push({
      endorserName: `${endorserFirst} ${endorserLast}`,
      endorserEmail: `endorser${i + 1}@northeastern.edu`,
      applicantName: `${applicantFirst} ${applicantLast}`,
      definingTraits: randomItem(ENDORSEMENT_CONTENT.definingTraits),
      leadershipQualities: randomItem(ENDORSEMENT_CONTENT.leadershipQualities),
      areasForDevelopment: randomItem(ENDORSEMENT_CONTENT.areasForDevelopment),
    })
  }

  await prisma.endorsement.createMany({
    data: endorsements,
    skipDuplicates: true,
  })
}
