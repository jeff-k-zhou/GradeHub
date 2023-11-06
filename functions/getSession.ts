import puppeteer from 'puppeteer';

export default async function getSession(username: string, password: string): Promise<any> {
    try {
        const browser = await puppeteer.launch({
            headless: true
        })
        console.log("Browser launched")
        const page = await browser.newPage()
        console.log("Page created")

        await page.setRequestInterception(true)
        console.log("Request interception enabled")

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
        console.log("Page loaded")

        await page.type("#LogOnDetails_UserName", username)
        await page.type("#LogOnDetails_Password", password)
        console.log("Credentials entered")
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click("#login")
        ])
        console.log("Logged in")

        const cookies = await page.cookies()
        console.log("Cookies obtained")

        await browser.close()
        console.log("Browser closed")

        return cookies
    } catch {
        return "error"
    }
}