import { db } from '../../lib/db'
import { COMMUNITY_CONSTITUENCIES } from './constants'

export async function seedCommunityConstituencies() {
  await db.communityConstituency.createMany({
    data: COMMUNITY_CONSTITUENCIES,
    skipDuplicates: true,
  })

  return db.communityConstituency.findMany()
}
