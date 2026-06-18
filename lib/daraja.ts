import axios from 'axios'

const DEV_MODE = process.env.DEV_MODE === 'true'
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || ''
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || ''
const PASSKEY = process.env.MPESA_PASSKEY || ''
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379'
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || ''

export async function getAccessToken(): Promise<string | null> {
  if (DEV_MODE || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.log('[DEV MODE] Mock access token')
    return 'mock_token_123'
  }

  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('Failed to get access token:', error)
    return null
  }
}

export async function stkPush(
  phone: string,
  amount: number,
  accountReference: string,
  transactionDesc: string
): Promise<any> {
  if (DEV_MODE || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.log(`[DEV MODE] STK Push to ${phone} for ${amount} KES`)
    return { success: true, CheckoutRequestID: 'mock_123' }
  }

  const token = await getAccessToken()
  if (!token) throw new Error('Failed to get access token')

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64')
  const formattedPhone = phone.replace(/^0/, '254')

  const data = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  }

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('STK Push failed:', error)
    throw error
  }
}