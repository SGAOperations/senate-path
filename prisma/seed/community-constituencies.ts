import { prisma } from '../seed'
import { COMMUNITY_CONSTITUENCIES } from './constants'

export async function seedCommunityConstituencies() {
  await prisma.communityConstituency.createMany({
    data: COMMUNITY_CONSTITUENCIES,
    skipDuplicates: true,
  })

  return prisma.communityConstituency.findMany()
}
