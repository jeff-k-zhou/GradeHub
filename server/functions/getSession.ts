import puppeteer from 'puppeteer'

export default async function getSession(username: string, password: string) {
    try {
        const browser = await puppeteer.launch({
            headless: "new"
        })
        const page = await browser.newPage()
        await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")

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
    } catch (error) {
        return error
    }
}