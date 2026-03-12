import 'dotenv/config'
import { initBot } from './lib/bot'

async function main() {
  console.log('🤖 Starting Telegram bot...')
  await initBot()
  
  console.log('Bot is running. Press Ctrl+C to stop.')
}

main().catch(console.error)
