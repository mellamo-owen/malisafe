// lib/insurance.ts - Insurance Partnership Configuration

export const INSURANCE_CONFIG = {
  primaryPartner: {
    name: 'Direct Assurance Insurance',
    shortName: 'Direct Assurance',
    logo: '/images/direct-assurance-logo.png',
    color: '#E31E24',
    secondaryColor: '#1A1A2E',
    claimsHotline: '0700 123 456',
    claimsEmail: 'claims@directassurance.co.ke',
    website: 'https://directassurance.co.ke',
    policyPrefix: 'DA',
  },
  partners: [
    {
      name: 'Jubilee Insurance',
      shortName: 'Jubilee',
      logo: '/images/jubilee-logo.png',
      color: '#1A3C6E',
      secondaryColor: '#E31E24',
      claimsHotline: '0700 789 012',
      claimsEmail: 'claims@jubilee.co.ke',
      website: 'https://jubilee.co.ke',
      policyPrefix: 'JI',
    }
  ]
}

export function getInsurancePartner(partnerName?: string) {
  if (!partnerName) return INSURANCE_CONFIG.primaryPartner
  const found = INSURANCE_CONFIG.partners.find(p => 
    p.name.toLowerCase() === partnerName.toLowerCase() ||
    p.shortName.toLowerCase() === partnerName.toLowerCase()
  )
  return found || INSURANCE_CONFIG.primaryPartner
}

export function generatePolicyNumber(prefix: string = 'DA'): string {
  const year = new Date().getFullYear()
  const random = Math.floor(100000 + Math.random() * 900000)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  return `${prefix}-${year}${month}-${random}`
}