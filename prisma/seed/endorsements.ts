import { prisma } from '../seed'
import { 
  FIRST_NAMES, 
  LAST_NAMES, 
  ENDORSEMENT_CONTENT, 
  randomItem,
  generateEmail,
} from './constants'

export async function seedEndorsements() {
  const endorsements = []

  for (let i = 0; i < 5; i++) {
    const endorserFirst = randomItem(FIRST_NAMES)
    const endorserLast = randomItem(LAST_NAMES)
    const applicantFirst = randomItem(FIRST_NAMES)
    const applicantLast = randomItem(LAST_NAMES)

    endorsements.push({
      endorserName: `${endorserFirst} ${endorserLast}`,
      endorserEmail: generateEmail(endorserFirst, endorserLast),
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
