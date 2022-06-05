import chromium from 'chrome-aws-lambda'
import playwright from 'playwright-core'

const getScreenshot = async (req, res) => {
  try {
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath:
        process.env.NODE_ENV === 'production'
          ? await chromium.executablePath
          : '/usr/local/bin/chromium',
      headless:
        process.env.NODE_ENV === 'production' ? chromium.headless : true,
    })

    const context = await browser.newContext()
    const page = await context.newPage()

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
