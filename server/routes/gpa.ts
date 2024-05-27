import express from "express"
import axios from "axios"
import * as cheerio from "cheerio"

const GpaRouter = express.Router()

GpaRouter.post("/getData", async (req, res) => {
    try {
        const response = await axios.get("https://hac.friscoisd.org/HomeAccess/Content/Student/ReportCards.aspx", {
            headers: {
                Cookie: req.body.cookies.map((cookie: any) => `${cookie}`).join("; "),
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31"
            }
        })
        const page = response.data.toString()
        const $ = cheerio.load(page)
        const login = $("#LogOnDetails_UserName")
        if (login.length !== 0) {
            res.json({
                error: true,
                errorCode: 3
            })
        } else {
            const rows = $(".sg-asp-table-data-row")
            const data: { classCode: string, grades: string[] }[] = []
            for (const row of rows) {
                const classCode = $(row).find("td").first()
                const grades = $(row).find("td > a[href='#']")
                const gradesData: string[] = []
                for (const grade of grades) {
                    if ($(grade).text().trim()) {
                        if (!isNaN(Number($(grade).text().trim()))) {
                            gradesData.push($(grade).text().trim())
                        }
                    }
                }
                data.push({
                    classCode: $(classCode).text().trim(),
                    grades: gradesData
                })
            }
            res.json({
                error: false,
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            error: true,
            errorCode: 1
        })
    }
})

export default GpaRouter