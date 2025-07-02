import { Builder, WebDriver, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import * as cheerio from 'cheerio'

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface SectionData {
  title: string
  url: string
  category: string
}

export interface ScrapedContent {
  id: string
  title: string
  category: string
  subcategory: string
  url: string
  content: {
    text: string
    tables: TableData[]
    images: string[]
  }
  metadata: {
    scrapedAt: string
    sourceUrl: string
  }
}

interface SiteMapSection {
  category: string
  subcategory: string
  title: string
  url: string
}

export class RadiologyAssistantScraper {
  private baseUrl = 'https://radiologyassistant.nl'
  private driver: WebDriver | null = null

  async scrapeEntireSite(): Promise<ScrapedContent[]> {
    console.log('Starting radiology assistant scraper...')
    
    try {
      await this.initializeDriver()
      
      console.log('Building site map...')
      const siteMap = await this.buildSiteMap()
      console.log(`Found ${siteMap.length} pages to scrape`)
      
      const allContent: ScrapedContent[] = []
      
      for (let i = 0; i < siteMap.length; i++) {
        const section = siteMap[i]
        console.log(`Scraping ${i + 1}/${siteMap.length}: ${section.title}`)
        
        try {
          const content = await this.scrapePage(section)
          if (content) {
            allContent.push(content)
          }
          
          await this.delay(1000)
        } catch (error) {
          console.error(`Error scraping ${section.url}:`, error)
        }
      }
      
      return allContent
    } finally {
      await this.cleanup()
    }
  }

  private async initializeDriver(): Promise<void> {
    const options = new Options()
    options.addArguments('--headless')
    options.addArguments('--no-sandbox')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--disable-gpu')
    options.addArguments('--window-size=1920,1080')
    
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  }

  private async buildSiteMap(): Promise<SiteMapSection[]> {
    if (!this.driver) throw new Error('Driver not initialized')
    
    const siteMap: SiteMapSection[] = []
    
    try {
      await this.driver.get(this.baseUrl)
      await this.driver.wait(until.titleContains('Radiology'), 10000)
      
      const pageSource = await this.driver.getPageSource()
      const $ = cheerio.load(pageSource)
      
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href')
        const text = $(element).text().trim()
        
        if (href && text && href.startsWith('/') && text.length > 0) {
          const fullUrl = this.baseUrl + href
          
          const urlParts = href.split('/').filter(part => part.length > 0)
          const category = urlParts[0] || 'General'
          const subcategory = urlParts[1] || 'Main'
          
          siteMap.push({
            category,
            subcategory,
            title: text,
            url: fullUrl
          })
        }
      })
      
      const uniqueMap = new Map()
      siteMap.forEach(item => {
        uniqueMap.set(item.url, item)
      })
      
      return Array.from(uniqueMap.values())
    } catch (error) {
      console.error('Error building site map:', error)
      return []
    }
  }

  private async scrapePage(section: SiteMapSection): Promise<ScrapedContent | null> {
    if (!this.driver) throw new Error('Driver not initialized')
    
    try {
      await this.driver.get(section.url)
      await this.delay(2000) // Wait for page to load
      
      const pageSource = await this.driver.getPageSource()
      const $ = cheerio.load(pageSource)
      
      const contentText = this.extractTextContent($)
      const tables = this.extractTables($)
      const images = this.extractImages($, section.url)
      
      const content: ScrapedContent = {
        id: this.generateId(section.url),
        title: section.title,
        category: section.category,
        subcategory: section.subcategory,
        url: section.url,
        content: {
          text: contentText,
          tables,
          images
        },
        metadata: {
          scrapedAt: new Date().toISOString(),
          sourceUrl: section.url
        }
      }
      
      return content
    } catch (error) {
      console.error(`Error scraping page ${section.url}:`, error)
      return null
    }
  }

  private extractTextContent($: cheerio.CheerioAPI): string {
    $('script, style, nav, header, footer').remove()
    
    const contentSelectors = [
      'main',
      '.content',
      '.article-content',
      '.page-content',
      'article',
      '.main-content'
    ]
    
    let content = ''
    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        content = element.text().trim()
        break
      }
    }
    
    if (!content) {
      content = $('body').text().trim()
    }
    
    return content.replace(/\s+/g, ' ').trim()
  }

  private extractTables($: cheerio.CheerioAPI): TableData[] {
    const tables: TableData[] = []
    
    $('table').each((_, table) => {
      const tableData: TableData = {
        headers: [],
        rows: []
      }
      
      $(table).find('thead tr th, tr:first-child th').each((_, th) => {
        tableData.headers.push($(th).text().trim())
      })
      
      $(table).find('tbody tr, tr').each((_, tr) => {
        const row: string[] = []
        $(tr).find('td').each((_, td) => {
          row.push($(td).text().trim())
        })
        if (row.length > 0) {
          tableData.rows.push(row)
        }
      })
      
      if (tableData.headers.length > 0 || tableData.rows.length > 0) {
        tables.push(tableData)
      }
    })
    
    return tables
  }

  private extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const images: string[] = []
    
    $('img').each((_, img) => {
      const src = $(img).attr('src')
      if (src) {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href
        images.push(absoluteUrl)
      }
    })
    
    return images
  }

  private generateId(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async cleanup(): Promise<void> {
    if (this.driver) {
      await this.driver.quit()
      this.driver = null
    }
  }
}
