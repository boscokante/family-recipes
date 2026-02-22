import { db } from '../db'
import { sql } from 'drizzle-orm'

async function createSchema() {
  console.log('📦 Creating family_recipes schema...')
  
  try {
    // Create the schema if it doesn't exist
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS family_recipes`)
    console.log('✅ Schema created successfully!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating schema:', error)
    process.exit(1)
  }
}

createSchema()
