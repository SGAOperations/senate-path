import { prisma } from '../seed'

export async function seedSettings() {
  await prisma.settings.create({
    data: {
      requiredNominations: 15,
      maxCommunityNominations: 7,
      endorsementRequired: false,
      endorsementsOpen: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: 'Welcome to the Student Senate Application System!',
    },
  })
}
