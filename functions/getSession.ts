import puppeteer from 'puppeteer';

export default async function getSession(username: string, password: string) {
    const browser = await puppeteer.launch({
        headless: "new"
    })
    const page = await browser.newPage()

    await page.goto("https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
        waitUntil: "domcontentloaded"
    })

    await page.type("#LogOnDetails_UserName", username)
    await page.type("#LogOnDetails_Password", password)
    await page.click("#login")

    const cookies = await page.cookies()

    await browser.close()

    return cookies
}