import { seedCommunityConstituencies } from './seed/community-constituencies'
import { seedSettings } from './seed/settings'
import { seedApplications } from './seed/applications'
import { seedNominations } from './seed/nominations'
import { seedEndorsements } from './seed/endorsements'
import { db } from '../lib/db'

async function main() {
  const nodeEnv = process.env.NODE_ENV || 'development'

  if (nodeEnv === 'production') {
    return
  }

  const existingData = await db.communityConstituency.findFirst()
  if (existingData) return

  const constituencies = await seedCommunityConstituencies()
  await seedSettings()
  await seedApplications(constituencies)
  await seedNominations(constituencies)
  await seedEndorsements()
}

main()
