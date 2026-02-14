import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Predefined data arrays
const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis']
const COLLEGES = ['Khoury College of Computer Sciences', 'College of Engineering', 'College of Science', 'D\'Amore-McKim School of Business', 'College of Social Sciences and Humanities']
const MAJORS = ['Computer Science', 'Data Science', 'Business Administration', 'Political Science', 'Biology']
const MINORS = ['Mathematics', 'Economics', 'Psychology', '', 'Philosophy']
const YEARS = [1, 2, 3, 4, 5]
const SEMESTERS = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026']
const CONSTITUENCIES = ['Khoury', 'Engineering', 'Science', 'Business', 'CSSH']
const PRONOUNS = ['he/him', 'she/her', 'they/them', 'she/they', 'he/they']

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Seeding disabled in production')
    return
  }

  const existingData = await prisma.communityConstituency.findFirst()
  if (existingData) {
    console.log('Already seeded, skipping...')
    return
  }

  console.log('Seeding database...')

  // Seed CommunityConstituency
  console.log('Seeding community constituencies...')
  const constituencies = await Promise.all([
    prisma.communityConstituency.create({
      data: {
        name: 'International Students',
        isActive: true,
      },
    }),
    prisma.communityConstituency.create({
      data: {
        name: 'First Generation Students',
        isActive: true,
      },
    }),
    prisma.communityConstituency.create({
      data: {
        name: 'Transfer Students',
        isActive: true,
      },
    }),
    prisma.communityConstituency.create({
      data: {
        name: 'Veterans and Military Affiliated',
        isActive: true,
      },
    }),
    prisma.communityConstituency.create({
      data: {
        name: 'LGBTQ+ Community',
        isActive: false,
      },
    }),
  ])

  // Seed Settings (singleton)
  console.log('Seeding settings...')
  await prisma.settings.create({
    data: {
      requiredNominations: 15,
      maxCommunityNominations: 7,
      endorsementRequired: false,
      endorsementsOpen: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      applicationsOpen: true,
      nominationsOpen: true,
      customMessage: 'Welcome to the Student Senate Application System!',
    },
  })

  // Seed Applications
  console.log('Seeding applications...')
  for (let i = 0; i < 5; i++) {
    const firstName = FIRST_NAMES[i]
    const lastName = LAST_NAMES[i]
    const fullName = `${firstName} ${lastName}`
    
    await prisma.application.create({
      data: {
        nuid: `00100000${i}`,
        fullName,
        preferredFullName: fullName,
        phoneticPronunciation: fullName,
        pronunciationAudioUrl: `https://example.com/audio/${i}.mp3`,
        pronouns: PRONOUNS[i],
        email: `user${i + 1}@northeastern.edu`,
        phoneNumber: `617-555-010${i}`,
        college: COLLEGES[i],
        major: MAJORS[i],
        minors: MINORS[i],
        year: YEARS[i],
        semester: SEMESTERS[i],
        constituency: CONSTITUENCIES[i],
        communityConstituencyId: i < 3 ? constituencies[i].id : null,
        whySenateLongAnswer: `I am passionate about representing ${CONSTITUENCIES[i]} students and making a positive impact on campus. I believe my experience and dedication make me a strong candidate for student senate.`,
        constituencyIssueLongAnswer: `The main issues facing ${CONSTITUENCIES[i]} students include access to resources, representation in decision-making, and building community. I plan to address these by working closely with administration and advocating for student needs.`,
        diversityEquityInclusionLongAnswer: 'I am committed to creating an inclusive environment where all students feel valued and heard. I will work to ensure diverse perspectives are represented in all discussions and decisions.',
        conflictSituationLongAnswer: 'In conflict situations, I believe in listening to all parties, finding common ground, and working collaboratively toward solutions that benefit everyone involved.',
        campaignBlurb: `Vote ${firstName} ${lastName} for Student Senate - Committed to representing your voice!`,
        nominationFormPdfUrl: `https://example.com/nominations/${i}.pdf`,
      },
    })
  }

  // Seed Nominations
  console.log('Seeding nominations...')
  const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'PENDING', 'APPROVED'] as const
  
  for (let i = 0; i < 5; i++) {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    
    await prisma.nomination.create({
      data: {
        nominee: `${firstName} ${lastName}`,
        fullName: `Nominator ${i + 1}`,
        email: `nominator${i + 1}@northeastern.edu`,
        college: randomItem(COLLEGES),
        major: randomItem(MAJORS),
        status: statuses[i],
        constituencyType: i % 2 === 0 ? 'academic' : 'community',
        communityConstituencyId: i % 2 === 1 && i < 4 ? constituencies[Math.floor(i / 2)].id : null,
      },
    })
  }

  // Seed Endorsements
  console.log('Seeding endorsements...')
  for (let i = 0; i < 5; i++) {
    const endorserFirst = randomItem(FIRST_NAMES)
    const endorserLast = randomItem(LAST_NAMES)
    const applicantFirst = FIRST_NAMES[i]
    const applicantLast = LAST_NAMES[i]
    
    await prisma.endorsement.create({
      data: {
        endorserName: `${endorserFirst} ${endorserLast}`,
        endorserEmail: `endorser${i + 1}@northeastern.edu`,
        applicantName: `${applicantFirst} ${applicantLast}`,
        definingTraits: 'Dedicated, passionate, and committed to student advocacy. Shows strong leadership potential and genuine care for the student body.',
        leadershipQualities: 'Excellent communication skills, ability to work collaboratively, strategic thinking, and proven track record of initiative.',
        areasForDevelopment: 'Could benefit from more experience in formal governance processes and public speaking in large settings.',
      },
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
