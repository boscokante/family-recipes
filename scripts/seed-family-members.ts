/**
 * Seed script for family members with allergy information
 * Run with: npx tsx scripts/seed-family-members.ts
 */

import { db } from '../db'
import { familyMembers } from '../db/schema'

async function seedFamilyMembers() {
  console.log('Seeding family members...')

  // Check if family members already exist
  const existing = await db.select().from(familyMembers)

  if (existing.length > 0) {
    console.log(`Family members already exist (${existing.length} found). Skipping seed.`)
    return
  }

  const members = [
    {
      name: 'Bosko',
      allergies: ['dairy', 'gluten', 'cashew'],
      allergyDetails: {
        dairy: { severity: 'strict', notes: 'Can have goat and buffalo dairy products' },
        gluten: { severity: 'strict' },
        cashew: { severity: 'avoid', notes: 'Slight intolerance, avoid when possible' }
      },
      substitutions: {
        butter: 'goat butter',
        cheese: 'goat cheese',
        milk: 'goat milk',
        'heavy cream': 'goat cream or coconut cream',
        'all-purpose flour': "Bob's Red Mill gluten-free 1-to-1 flour",
        'bread flour': "Bob's Red Mill gluten-free flour",
        'wheat flour': "Bob's Red Mill gluten-free flour",
        'regular flour': "Bob's Red Mill gluten-free flour",
        cornmeal: "Bob's Red Mill gluten-free cornmeal",
        cashews: 'sunflower seeds or omit'
      },
      isActive: true
    },
    {
      name: 'Maya',
      allergies: ['citrus', 'shellfish'],
      allergyDetails: {
        citrus: { severity: 'strict' },
        shellfish: { severity: 'strict', notes: 'Crab, lobster, shrimp - but octopus, squid, clams are OK' }
      },
      substitutions: {
        'lemon juice': 'citric acid or lemon extract (alcohol-based)',
        lemon: 'lemongrass or lemon extract',
        'lime juice': 'citric acid solution',
        lime: 'lemongrass',
        orange: 'persimmon or mango',
        'lemon zest': 'dried lemon peel or omit',
        shrimp: 'octopus or squid',
        crab: 'imitation crab (surimi) or omit',
        lobster: 'omit or use fish',
        prawns: 'octopus or squid'
      },
      isActive: true
    },
    {
      name: 'Che',
      allergies: ['dairy', 'gluten', 'fish', 'citrus'],
      allergyDetails: {
        dairy: { severity: 'strict', notes: 'Can have goat and buffalo dairy products' },
        gluten: { severity: 'strict' },
        fish: { severity: 'strict' },
        citrus: { severity: 'strict' }
      },
      substitutions: {
        butter: 'goat butter',
        cheese: 'goat cheese',
        milk: 'goat milk',
        'heavy cream': 'goat cream or coconut cream',
        'all-purpose flour': "Bob's Red Mill gluten-free 1-to-1 flour",
        'bread flour': "Bob's Red Mill gluten-free flour",
        'wheat flour': "Bob's Red Mill gluten-free flour",
        'regular flour': "Bob's Red Mill gluten-free flour",
        cornmeal: "Bob's Red Mill gluten-free cornmeal",
        'lemon juice': 'citric acid or lemon extract',
        lemon: 'lemongrass',
        'lime juice': 'citric acid solution',
        lime: 'lemongrass',
        'fish sauce': 'coconut aminos',
        shrimp: 'omit',
        crab: 'omit',
        salmon: 'omit',
        tuna: 'omit'
      },
      isActive: true
    }
  ]

  for (const member of members) {
    await db.insert(familyMembers).values({
      name: member.name,
      allergies: member.allergies,
      allergyDetails: member.allergyDetails,
      substitutions: member.substitutions,
      isActive: member.isActive
    })
    console.log(`  ✓ Added ${member.name}`)
  }

  console.log(`\nSeeded ${members.length} family members successfully!`)
}

seedFamilyMembers()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error seeding family members:', error)
    process.exit(1)
  })
