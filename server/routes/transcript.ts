import express from "express"
import axios from "axios"
import * as cheerio from "cheerio"

const TranscriptRouter = express.Router()

TranscriptRouter.post("/getTranscript", async (req, res) => {
    if (!req.body.cookies) {
        res.json({
            error: true,
            errorCode: 3
        })
        console.log("here")
    } else {
        try {
            let response = await axios.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx", {
                headers: {
                    Cookie: req.body.cookies!.map((cookie: any) => `${cookie}`).join("; "),
                    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31"
                }
            })
            let page = response.data.toString()
            let $ = cheerio.load(page)
            const login = $("#LogOnDetails_UserName")
            if (login.length !== 0) {
                res.json({
                    error: true,
                    errorCode: 3
                })
            } else {
                const tables = $(".sg-transcript-group")
                let data: { credits: string, course: string, description: string, sem1: any, sem2: any, fin: any }[][] = []
                let headers: {
                    year: string,
                    grade: string,
                    building: string
                }[] = []
                let footers: string[] = []
                for (let i = 0; i < tables.length; i++) {
                    const year = $(tables[i]).find(`#plnMain_rpTranscriptGroup_lblYearValue_${i}`).text()
                    const grade = $(tables[i]).find(`#plnMain_rpTranscriptGroup_lblGradeValue_${i}`).text()
                    const building = $(tables[i]).find(`#plnMain_rpTranscriptGroup_lblBuildingValue_${i}`).text()
                    footers.push($(tables[i]).find(`#plnMain_rpTranscriptGroup_LblTCreditValue_${i}`).text())
                    headers.push({
                        year: year,
                        grade: grade,
                        building: building
                    })
                    const rows = $(tables[i]).find(".sg-asp-table-data-row")
                    data.push([])
                    for (let j = 0; j < rows.length; j++) {
                        const values = $(rows[j]).find("td")
                        for (let k = 0; k < values.length; k++) {
                            switch (k) {
                                case 0:
                                    data[i][j] = {
                                        ...data[i][j],
                                        course: $(values[k]).text()
                                    }
                                    break
                                case 1:
                                    data[i][j] = {
                                        ...data[i][j],
                                        description: $(values[k]).text()
                                    }
                                    break
                                case 2:
                                    data[i][j] = {
                                        ...data[i][j],
                                        sem1: $(values[k]).text()
                                    }
                                    break
                                case 3:
                                    data[i][j] = {
                                        ...data[i][j],
                                        sem2: $(values[k]).text()
                                    }
                                    break
                                case 4:
                                    data[i][j] = {
                                        ...data[i][j],
                                        fin: $(values[k]).text()
                                    }
                                    break
                                case 5:
                                    data[i][j] = {
                                        ...data[i][j],
                                        credits: $(values[k]).text()
                                    }
                                    break
                            }
                        }
                    }
                }
                const cumGPA = $("#plnMain_rpTranscriptGroup_lblGPACum1").text()
                const rank = $("#plnMain_rpTranscriptGroup_lblGPARank1").text()
                const unweightedGPA = $("#plnMain_rpTranscriptGroup_lblGPACum2").text()
                res.json({
                    error: false,
                    data: data,
                    headers: headers,
                    footers: footers,
                    gpa: {
                        weighted: cumGPA,
                        unweighted: unweightedGPA
                    },
                    rank: rank
                })
            }
        } catch (error) {
            res.json({
                error: true,
                errorCode: 1
            })
        }
    }
})

export default TranscriptRouter