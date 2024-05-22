import axios from 'axios'
import * as cheerio from 'cheerio'
import { wrapper } from 'axios-cookiejar-support'
import tough from "tough-cookie"

export default async function getSession(username: string, password: string) {
    try {
        const jar = new tough.CookieJar()
        const instance = wrapper(axios.create({
            withCredentials: true,
            jar: jar
        }))
        const response = await instance.get("https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                "Connection": "keep-alive"
            }
        })
        const page = response.data.toString()
        const $ = cheerio.load(page)
        const token = $("input[name=__RequestVerificationToken]").attr("value")
        console.log(token)
        const postData = {
            __RequestVerificationToken: token,
            SCKTY00328510CustomEnabled: "False",
            SCKTY00436568CustomEnabled: "False",
            Database: "10",
            VerificationOption: "UsernamePassword",
            "LogOnDetails.UserName": username,
            tempUN: "",
            tempPW: "",
            "LogOnDetails.Password": password,
        }
        const login = await instance.post("https://hac.friscoisd.org/HomeAccess/Account/LogOn", postData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
            },
            withCredentials: true,
        })
        let cookies: any = await jar.getCookies("https://hac.friscoisd.org")
        for (let i = 0; i < cookies!.length; i++) {
            const index = cookies![i].toString().indexOf(" Path=/")
            cookies![i] = cookies![i].toString().substring(0, index)
        }
        return {
            error: false,
            cookies: cookies
        }
    } catch (error) {
        return {
            error: true,
            data: error
        }
    }
}

/* try {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = (await browser.pages())[0]

    await page.setCacheEnabled(false)

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

    return {
        error: false,
        cookies: cookies
    }
} catch (error) {
    return {
        error: true,
        data: error
    }
} */