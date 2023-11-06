import puppeteer from 'puppeteer';

export default async function getSession(username: string, password: string): Promise<any> {
    let steps = []
    try {
        const browser = await puppeteer.launch({
            headless: "new"
        })
        steps.push("Browser launched")
        const page = await browser.newPage()
        steps.push("Page created")

        await page.setRequestInterception(true)
        steps.push("Request interception enabled")

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
        steps.push("Page loaded")

        await page.type("#LogOnDetails_UserName", username)
        await page.type("#LogOnDetails_Password", password)
        steps.push("Credentials entered")
        await Promise.all([
            page.waitForNavigation({
                waitUntil: "domcontentloaded"
            }),
            page.click("#login")
        ])
        steps.push("Logged in")

        const cookies = await page.cookies()
        steps.push("Cookies obtained")

        await browser.close()
        steps.push("Browser closed")

        return steps
    } catch {
        return steps
    }
}