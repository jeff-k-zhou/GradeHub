import puppeteer from 'puppeteer';

export default async function getSession(username: string, password: string): Promise<any> {
    try {
        const browser = await puppeteer.launch({
            headless: true
        })
        const page = await browser.newPage()

        await page.setRequestInterception(true)

        page.on("request", (request) => {
            if (request.resourceType() === "image" || request.resourceType() === "stylesheet" || request.resourceType() === "font") {
                request.abort()
            } else {
                request.continue()
            }
        })

        await page.goto("https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
            waitUntil: "domcontentloaded"
        })

        await page.type("#LogOnDetails_UserName", username)
        await page.type("#LogOnDetails_Password", password)
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click("#login")
        ])

        const cookies = await page.cookies()

        await browser.close()

        return cookies
    } catch {
        return "error"
    }
}