import express, { Express, Request, Response } from 'express'
import axios from "axios"
import jsdom from "jsdom"
import cors from "cors"
import getSession from './functions/getSession'
import aesjs from "aes-js"

const app: Express = express()
app.use(express.json())
app.use(cors())

app.post("/getGrades", (req: Request, res: Response) => {
    getSession(req.body.username, req.body.password).then((credentials) => {
        if (credentials === "error") {
            console.log("this is the issue")
            res.json({
                error: true,
                errorCode: 1
            })
        } else {
            axios.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", {
                headers: {
                    Cookie: credentials.map((cookie: any) => `${cookie.name}=${cookie.value}`).join("; "),
                    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31"
                }
            }).then((response) => {
                const page = response.data.toString()
                const dom = new jsdom.JSDOM(page)
                const document = dom.window.document
                const login = document.querySelector("#LogOnDetails_UserName")
                if (login !== null) {
                    res.json({
                        error: true,
                        errorCode: 3
                    })
                } else {
                    const courses = document.querySelectorAll(".AssignmentClass")
                    if (courses.length === 0) {
                        res.json({
                            error: true,
                            errorCode: 2
                        })
                    } else {
                        let mp: string | string[] = ""
                        document.querySelector("#plnMain_ddlReportCardRuns")?.querySelectorAll("option").forEach((option) => {
                            if (option.getAttribute("selected") === "selected") {
                                mp = option.value
                            }
                        })
                        mp = mp.split("-")
                        const year = mp[mp.length - 1].trim()
                        const nineWeeks = mp[0].trim()
                        const postData = {
                            __EVENTTARGET: "ctl00$plnMain$btnRefreshView",
                            __EVENTARGUMENT: "",
                            __VIEWSTATE: document.querySelector("#__VIEWSTATE")?.getAttribute("value"),
                            __VIEWSTATEGENERATOR: document.querySelector("#__VIEWSTATEGENERATOR")?.getAttribute("value"),
                            __EVENTVALIDATION: document.querySelector("#__EVENTVALIDATION")?.getAttribute("value"),
                            ctl00$plnMain$hdnValidMHACLicense: "Y",
                            ctl00$plnMain$hdnIsVisibleClsWrk: "N",
                            ctl00$plnMain$hdnIsVisibleCrsAvg: "N",
                            ctl00$plnMain$hdnJsAlert: "Averages cannot be displayed when  Report Card Run is set to(All Runs).",
                            ctl00$plnMain$hdnTitle: "Classwork",
                            ctl00$plnMain$hdnLastUpdated: "Last Updated",
                            ctl00$plnMain$hdnDroppedCourse: "This course was dropped as of",
                            ctl00$plnMain$hdnddlClasses: "(All Classes)",
                            ctl00$plnMain$hdnddlCompetencies: "(All Classes)",
                            ctl00$plnMain$hdnCompDateDue: "Date Due",
                            ctl00$plnMain$hdnCompDateAssigned: "Date Assigned",
                            ctl00$plnMain$hdnCompCourse: "Course",
                            ctl00$plnMain$hdnCompAssignment: "Assignment",
                            ctl00$plnMain$hdnCompAssignmentLabel: "Assignments Not Related to Any Competency",
                            ctl00$plnMain$hdnCompNoAssignments: "No assignments found",
                            ctl00$plnMain$hdnCompNoClasswork: "Classwork could not be found for this competency for the selected report card run.",
                            ctl00$plnMain$hdnCompScore: "Score",
                            ctl00$plnMain$hdnCompPoints: "Points",
                            ctl00$plnMain$hdnddlReportCardRuns1: "(All Runs)",
                            ctl00$plnMain$hdnddlReportCardRuns2: "(All Terms)",
                            ctl00$plnMain$hdnbtnShowAverage: "Show All Averages",
                            ctl00$plnMain$hdnShowAveragesToolTip: "Show all student's averages",
                            ctl00$plnMain$hdnPrintClassworkToolTip: "Print all classwork",
                            ctl00$plnMain$hdnPrintClasswork: "Print Classwork",
                            ctl00$plnMain$hdnCollapseToolTip: "Collapse all courses",
                            ctl00$plnMain$hdnCollapse: "Collapse All",
                            ctl00$plnMain$hdnFullToolTip: "Switch courses to Full View",
                            ctl00$plnMain$hdnViewFull: "Full View",
                            ctl00$plnMain$hdnQuickToolTip: "Switch courses to Quick View",
                            ctl00$plnMain$hdnViewQuick: "Quick View",
                            ctl00$plnMain$hdnExpand: "Expand All",
                            ctl00$plnMain$hdnExpandToolTip: "Expand all courses",
                            ctl00$plnMain$hdnChildCompetencyMessage: "This competency is calculated as an average of the following competencies",
                            ctl00$plnMain$hdnCompetencyScoreLabel: "Grade",
                            ctl00$plnMain$hdnAverageDetailsDialogTitle: "Average Details",
                            ctl00$plnMain$hdnAssignmentCompetency: "Assignment Competency",
                            ctl00$plnMain$hdnAssignmentCourse: "Assignment Course",
                            ctl00$plnMain$hdnTooltipTitle: "Title",
                            ctl00$plnMain$hdnCategory: "Category",
                            ctl00$plnMain$hdnDueDate: "Due Date",
                            ctl00$plnMain$hdnMaxPoints: "Max Points",
                            ctl00$plnMain$hdnCanBeDropped: "Can Be Dropped",
                            ctl00$plnMain$hdnHasAttachments: "Has Attachments",
                            ctl00$plnMain$hdnExtraCredit: "Extra Credit",
                            ctl00$plnMain$hdnType: "Type",
                            ctl00$plnMain$hdnAssignmentDataInfo: "Information could not be found for the assignment",
                            ctl00$plnMain$ddlReportCardRuns: `${req.body.mp ? req.body.mp : nineWeeks}-${year}`,
                            ctl00$plnMain$ddlClasses: "ALL",
                            ctl00$plnMain$ddlCompetencies: "ALL",
                            ctl00$plnMain$ddlOrderBy: "Class",
                        }
                        axios.post("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", postData, {
                            headers: {
                                Cookie: credentials.map((cookie: any) => `${cookie.name}=${cookie.value}`).join("; "),
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }).then((response) => {
                            const page = response.data.toString()
                            const dom = new jsdom.JSDOM(page)
                            const document = dom.window.document
                            const courses = document.querySelectorAll(".AssignmentClass")
                            const data: { name: string, code: string, grade: string, assignments: object[] }[] = []
                            for (const course of courses) {
                                const fullName = course.querySelector(".sg-header-heading")!.textContent
                                const code = fullName?.match(/([A-Z])\w+\s-\s[0-9]/g)![0]
                                const name = fullName?.replace(code!, "").trim()
                                const testGrade = course.querySelector(".sg-header-heading.sg-right")?.textContent?.match(/[0-9]*\.[0-9]+/i)
                                if (testGrade === null) {
                                    data.push({
                                        name: name!,
                                        code: code!,
                                        grade: "",
                                        assignments: []
                                    })
                                    continue
                                }
                                const grade = testGrade![0]
                                const assignments = course.querySelector(".sg-asp-table")
                                const assignmentTable = assignments!.querySelectorAll(".sg-asp-table-data-row")
                                const assignmentsData: { due: string, assigned: string, name: string, category: string, score: string, totalPoints: string }[] = []
                                for (const assignment of assignmentTable) {
                                    const content = assignment.querySelectorAll("td")
                                    const due = content[0].textContent?.trim()
                                    const assigned = content[1].textContent?.trim()
                                    const name = content[2].textContent?.replace(/\n/g, "").replace("*", "").trim()
                                    const category = content[3].textContent?.replace(/\n/g, "").replace("*", "").trim()
                                    const score = content[4].textContent?.replace(/\n/g, "").replace("*", "").trim()
                                    const totalPoints = content[5].textContent?.trim()
                                    assignmentsData.push({
                                        due: due!,
                                        assigned: assigned!,
                                        name: name!,
                                        category: category!,
                                        score: score!,
                                        totalPoints: totalPoints!
                                    })
                                }
                                data.push({
                                    name: name!,
                                    code: code!,
                                    grade: grade!,
                                    assignments: assignmentsData
                                })
                            }
                            res.json({
                                error: false,
                                grades: data,
                                mp: req.body.mp ? req.body.mp : nineWeeks
                            })
                        })
                    }
                }
            }).catch((error) => {
                console.log(error)
                res.json({
                    error: true,
                    errorCode: 1
                })
            })
        }
    })
})

app.post("/verify", (req: Request, res: Response) => {
    getSession(req.body.username, req.body.password).then((credentials) => {
        axios.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", {
            headers: {
                Cookie: credentials.map((cookie: any) => `${cookie.name}=${cookie.value}`).join("; "),
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome"
            }
        }).then((response) => {
            const page = response.data.toString()
            const dom = new jsdom.JSDOM(page)
            const document = dom.window.document
            const login = document.querySelector("#LogOnDetails_UserName")
            if (login !== null) {
                res.json({
                    error: true,
                    errorCode: 3
                })
            } else {
                res.json({
                    error: false
                })
            }
        }).catch(() => {
            res.json({
                error: true,
                errorCode: 1
            })
        })
    })
})

app.post("/encrypt", (req: Request, res: Response) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    const usernameBytes = aesjs.utils.utf8.toBytes(req.body.username)
    const passwordBytes = aesjs.utils.utf8.toBytes(req.body.password)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
    const username = aesjs.utils.hex.fromBytes(aesCtr.encrypt(usernameBytes))
    const password = aesjs.utils.hex.fromBytes(aesCtr.encrypt(passwordBytes))

    res.json({
        username: username,
        password: password
    })
})

app.post("/decrypt", (req: Request, res: Response) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    const usernameBytes = aesjs.utils.hex.toBytes(req.body.username)
    const passwordBytes = aesjs.utils.hex.toBytes(req.body.password)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
    const username = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(usernameBytes))
    const password = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(passwordBytes))

    res.json({
        username: username,
        password: password
    })
})

app.listen(5000, () => console.log("Server running on port 5000"))

