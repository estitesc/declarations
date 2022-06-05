import puppeteer from '../../utils/puppeteer'
import chrome from 'chrome-aws-lambda'

const getScreenshot = async (req, res) => {
  try {
    const browser = await puppeteer.launch(
      process.env.NODE_ENV === 'production'
        ? {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
          }
        : {}
    )

    const page = await browser.newPage()

    page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:86.0) Gecko/20100101 Firefox/86.0'
    )

    await page.setViewport({
      width: 1600,
      height: 1600,
    })

    await page.goto(req.query.url)
    const screenshot = await page.screenshot()

    await browser.close()

    res.setHeader('content-type', 'image/png')
    res.status(200).send(screenshot)
  } catch (error) {
    console.log(error)
  }
}

export default getScreenshot
