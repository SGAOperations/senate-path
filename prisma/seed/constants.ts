// Predefined data arrays
export const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey']
export const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis']
export const COLLEGES = [
  'Khoury College of Computer Sciences',
  'College of Engineering',
  'College of Science',
  'D\'Amore-McKim School of Business',
  'College of Social Sciences and Humanities'
]
export const MAJORS = ['Computer Science', 'Data Science', 'Business Administration', 'Political Science', 'Biology']
export const MINORS = ['Mathematics', 'Economics', 'Psychology', '', 'Philosophy']
export const YEARS = [1, 2, 3, 4, 5]
export const SEMESTERS = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026']
export const CONSTITUENCIES = ['Khoury', 'Engineering', 'Science', 'Business', 'CSSH']
export const PRONOUNS = ['he/him', 'she/her', 'they/them', 'she/they', 'he/they']

export const COMMUNITY_CONSTITUENCIES = [
  { name: 'International Students', isActive: true },
  { name: 'First Generation Students', isActive: true },
  { name: 'Transfer Students', isActive: true },
  { name: 'Veterans and Military Affiliated', isActive: true },
  { name: 'LGBTQ+ Community', isActive: false }
]

export const LONG_ANSWERS = {
  whySenate: [
    'I am passionate about representing students and making a positive impact on campus. I believe my experience and dedication make me a strong candidate for student senate.',
    'Student government has always been important to me as a way to create meaningful change. I want to ensure every voice is heard in decision-making processes.',
    'My goal is to bridge the gap between students and administration, advocating for policies that improve campus life and academic experiences.',
    'I have a track record of leadership and want to use those skills to serve the student body and address pressing issues facing our community.',
    'Being part of student senate would allow me to work on initiatives I care about while representing the diverse perspectives of my fellow students.'
  ],
  constituencyIssue: [
    'The main issues include access to resources, representation in decision-making, and building community. I plan to address these by working closely with administration and advocating for student needs.',
    'Students face challenges with academic support, mental health resources, and campus engagement. I will work to expand services and create more inclusive programs.',
    'Key concerns are affordability, career preparation, and campus safety. I will collaborate with stakeholders to develop comprehensive solutions.',
    'We need better communication between students and faculty, improved facilities, and more opportunities for student involvement in governance.',
    'The biggest issues are accessibility, equity in resource distribution, and creating a welcoming environment for all students regardless of background.'
  ],
  diversityEquityInclusion: [
    'I am committed to creating an inclusive environment where all students feel valued and heard. I will work to ensure diverse perspectives are represented in all discussions and decisions.',
    'Diversity strengthens our community. I will advocate for programs that celebrate different cultures and create spaces for meaningful dialogue across differences.',
    'Equity means ensuring everyone has access to the resources they need. I will push for policies that address systemic barriers and promote equal opportunity.',
    'Inclusion requires active effort. I will work to amplify marginalized voices and ensure decision-making processes reflect the full diversity of our student body.',
    'I believe in proactive measures to create belonging, from inclusive events to equitable policies that support students from all backgrounds.'
  ],
  conflictSituation: [
    'In conflict situations, I believe in listening to all parties, finding common ground, and working collaboratively toward solutions that benefit everyone involved.',
    'I approach conflicts with empathy and patience, seeking to understand different perspectives before proposing resolutions that address root causes.',
    'My strategy is to facilitate open dialogue, mediate disputes fairly, and find creative compromises that respect everyone\'s needs and concerns.',
    'I handle conflicts by staying calm, gathering all relevant information, and working with stakeholders to develop mutually beneficial solutions.',
    'Conflict resolution requires active listening, clear communication, and a commitment to fairness. I focus on building consensus and maintaining relationships.'
  ]
}

export const ENDORSEMENT_CONTENT = {
  definingTraits: [
    'Dedicated, passionate, and committed to student advocacy. Shows strong leadership potential and genuine care for the student body.',
    'Innovative thinker with excellent interpersonal skills. Demonstrates reliability, integrity, and a collaborative approach to problem-solving.',
    'Empathetic listener who builds consensus. Shows resilience, creativity, and dedication to making positive change on campus.',
    'Natural leader with strong communication abilities. Displays initiative, responsibility, and genuine commitment to serving others.',
    'Strategic and thoughtful with a proven track record. Combines vision with practical action and inspires others through example.'
  ],
  leadershipQualities: [
    'Excellent communication skills, ability to work collaboratively, strategic thinking, and proven track record of initiative.',
    'Strong organizational abilities, empowers team members, thinks critically under pressure, and maintains ethical standards.',
    'Builds inclusive teams, delegates effectively, stays focused on goals, and adapts well to changing circumstances.',
    'Inspires trust and confidence, makes thoughtful decisions, takes accountability, and demonstrates emotional intelligence.',
    'Motivates others toward shared vision, balances multiple priorities, communicates clearly, and leads by example.'
  ],
  areasForDevelopment: [
    'Could benefit from more experience in formal governance processes and public speaking in large settings.',
    'Would grow from additional exposure to budget management and long-term strategic planning.',
    'Could develop skills in conflict mediation and navigating complex organizational structures.',
    'Would benefit from experience managing larger teams and coordinating multi-stakeholder initiatives.',
    'Could strengthen abilities in data analysis and evidence-based policy development.'
  ]
}

export const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
