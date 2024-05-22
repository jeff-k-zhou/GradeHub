"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const tough_cookie_1 = __importDefault(require("tough-cookie"));
async function getSession(username, password) {
    try {
        const jar = new tough_cookie_1.default.CookieJar();
        const instance = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
            withCredentials: true,
            jar: jar
        }));
        const response = await instance.get("https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                "Connection": "keep-alive"
            }
        });
        const page = response.data.toString();
        const $ = cheerio.load(page);
        const token = $("input[name=__RequestVerificationToken]").attr("value");
        console.log(token);
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
        };
        const login = await instance.post("https://hac.friscoisd.org/HomeAccess/Account/LogOn", postData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
            },
            withCredentials: true,
        });
        let cookies = await jar.getCookies("https://hac.friscoisd.org");
        for (let i = 0; i < cookies.length; i++) {
            const index = cookies[i].toString().indexOf(" Path=/");
            cookies[i] = cookies[i].toString().substring(0, index);
        }
        return {
            error: false,
            cookies: cookies
        };
    }
    catch (error) {
        return {
            error: true,
            data: error
        };
    }
}
exports.default = getSession;
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
