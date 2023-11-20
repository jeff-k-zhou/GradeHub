"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
function getSession(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield puppeteer_1.default.launch({
                headless: "new",
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });
            const page = (yield browser.pages())[0];
            yield page.setRequestInterception(true);
            page.on("request", (request) => {
                if (request.resourceType() === "image" || request.resourceType() === "stylesheet" || request.resourceType() === "font") {
                    request.abort();
                }
                else {
                    request.continue();
                }
            });
            yield page.goto("https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
                waitUntil: "domcontentloaded"
            });
            yield page.type("#LogOnDetails_UserName", username);
            yield page.type("#LogOnDetails_Password", password);
            yield Promise.all([
                page.waitForNavigation({
                    waitUntil: "domcontentloaded"
                }),
                page.click("#login")
            ]);
            const cookies = yield page.cookies();
            yield browser.close();
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
    });
}
exports.default = getSession;
