import africastalking from 'africastalking'

const AT_API_KEY = process.env.AT_API_KEY || ''
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox'
const DEV_MODE = process.env.DEV_MODE === 'true'

let africasTalking: any = null

if (AT_API_KEY && !DEV_MODE) {
  africasTalking = africastalking({
    apiKey: AT_API_KEY,
    username: AT_USERNAME,
  })
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  const phone = to.startsWith('0') ? `254${to.slice(1)}` : to
  
  if (DEV_MODE || !AT_API_KEY) {
    console.log(`[DEV MODE] SMS to ${phone}: ${message}`)
    return true
  }

  try {
    const result = await africasTalking.SMS.send({
      to: phone,
      message,
      from: process.env.AT_SENDER_ID || 'MaliSafe',
    })
    console.log('SMS sent:', result)
    return true
  } catch (error) {
    console.error('SMS failed:', error)
    return false
  }
}