import { PrismaClient } from '@prisma/client'
import { COMMUNITY_CONSTITUENCIES } from './constants'

export async function seedCommunityConstituencies(prisma: PrismaClient) {
  const constituencies = await prisma.communityConstituency.createMany({
    data: COMMUNITY_CONSTITUENCIES,
    skipDuplicates: true,
  })

  return prisma.communityConstituency.findMany()
}
