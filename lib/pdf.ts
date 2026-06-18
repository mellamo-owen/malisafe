import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export async function generateClaimPDF(item: any, claim: any): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'claims')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const filename = `${item.malisafeId}.pdf`
  const filepath = path.join(dir, filename)

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const stream = fs.createWriteStream(filepath)
    
    doc.pipe(stream)
    
    doc.fontSize(20).text('MALISAFE INSURANCE CLAIM FORM + POLICE ABSTRACT', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
    doc.moveDown()
    
    doc.fontSize(16).text('ITEM DETAILS', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Item Name: ${item.itemName}`)
    doc.text(`Serial Number: ${item.serial}`)
    doc.text(`Price: KES ${item.price}`)
    doc.text(`MaliSafe ID: ${item.malisafeId}`)
    doc.text(`Policy Number: ${item.policyNumber || 'N/A'}`)
    doc.text(`Insurance Company: ${item.insuranceCompany || 'N/A'}`)
    doc.moveDown()
    
    doc.fontSize(16).text('CUSTOMER DETAILS', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Name: ${item.customerName}`)
    doc.text(`Phone: ${item.customerPhone}`)
    doc.moveDown()
    
    doc.fontSize(16).text('SHOP DETAILS', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Shop Name: ${item.shop.name}`)
    doc.text(`Shop Phone: ${item.shop.phone}`)
    doc.moveDown()
    
    doc.fontSize(16).text('REGISTRATION INFORMATION', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Date Registered: ${new Date(item.createdAt).toLocaleDateString()}`)
    doc.text(`Claim Date: ${new Date(claim.createdAt).toLocaleDateString()}`)
    doc.text(`Claim Amount: KES ${claim.amount}`)
    doc.text(`Claim Number: ${claim.claimNumber || 'N/A'}`)
    doc.moveDown()
    
    doc.fontSize(16).text('DECLARATION', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text('I hereby declare that the above information is true and correct to the best of my knowledge.')
    doc.text('I confirm that the item described above has been lost/stolen under the following circumstances:')
    doc.moveDown()
    doc.text('___________________________________________')
    doc.moveDown()
    doc.text('Signature: ____________________')
    doc.moveDown(2)
    
    doc.fontSize(16).text('POLICE STAMP & SIGNATURE', { underline: true })
    doc.moveDown(0.5)
    doc.rect(100, doc.y, 400, 100).stroke()
    doc.text('OFFICIAL POLICE STAMP', 250, doc.y + 40, { align: 'center' })
    
    doc.end()
    
    stream.on('finish', () => resolve(`/claims/${filename}`))
    stream.on('error', reject)
  })
}