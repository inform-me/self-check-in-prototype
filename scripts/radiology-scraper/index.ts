import { RadiologyAssistantScraper } from './RadiologyAssistantScraper'
import * as fs from 'fs-extra'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  console.log('Starting Radiology Assistant scraper...')
  
  try {
    const scraper = new RadiologyAssistantScraper()
    const data = await scraper.scrapeEntireSite()
    
    console.log(`Successfully scraped ${data.length} articles`)
    
    const outputDir = path.resolve(__dirname, '../../src/assets/scraped-data')
    await fs.ensureDir(outputDir)
    
    const outputPath = path.join(outputDir, 'radiology-assistant.json')
    await fs.outputFile(outputPath, JSON.stringify(data, null, 2))
    
    console.log(`Data written to: ${outputPath}`)
    console.log(`Scraped ${data.length} articles from Radiology Assistant`)
    
    const categoryCount = new Map<string, number>()
    data.forEach(item => {
      const count = categoryCount.get(item.category) || 0
      categoryCount.set(item.category, count + 1)
    })
    
    console.log('\nSummary by category:')
    categoryCount.forEach((count, category) => {
      console.log(`  ${category}: ${count} articles`)
    })
    
  } catch (error) {
    console.error('Error running scraper:', error)
    process.exit(1)
  }
}

main().catch(console.error)
