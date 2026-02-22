import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { hashSync } from 'bcryptjs'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

const email = process.env.ADMIN_EMAIL || 'admin@trekante.com'
const password = process.env.ADMIN_PASSWORD || 'admin123'
const name = process.env.ADMIN_NAME || 'Admin'

async function createAdminUser() {
  console.log('🔐 Creating admin user...\n')
  
  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then(rows => rows[0])
  
  if (existing) {
    console.log(`⚠️  User with email "${email}" already exists!`)
    console.log('   If you want to update the password, delete the user first or use a different email.\n')
    return
  }
  
  // Generate password hash
  const passwordHash = hashSync(password, 10)
  
  // Insert user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      name,
      role: 'admin',
      passwordHash,
    })
    .returning()
  
  console.log('✅ Admin user created successfully!\n')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('👤 Name:', name)
  console.log('🎭 Role: admin\n')
  console.log('⚠️  IMPORTANT: Change the password after first login!\n')
}

createAdminUser()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  })


