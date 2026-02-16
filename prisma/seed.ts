import { PrismaClient } from '@prisma/client'
import { seedCommunityConstituencies } from './seed/community-constituencies'
import { seedSettings } from './seed/settings'
import { seedApplications } from './seed/applications'
import { seedNominations } from './seed/nominations'
import { seedEndorsements } from './seed/endorsements'

export const prisma = new PrismaClient()

async function main() {
  const nodeEnv = process.env.NODE_ENV || 'development'

  if (nodeEnv === 'production') {
    return
  }

  const existingData = await prisma.communityConstituency.findFirst()
  if (existingData) return

  const constituencies = await seedCommunityConstituencies()
  await seedSettings()
  await seedApplications(constituencies)
  await seedNominations(constituencies)
  await seedEndorsements()
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
