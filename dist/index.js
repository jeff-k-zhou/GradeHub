"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = __importDefault(require("jsdom"));
const cors_1 = __importDefault(require("cors"));
const getSession_1 = __importDefault(require("./functions/getSession"));
const aes_js_1 = __importDefault(require("aes-js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/getGrades", (req, res) => {
    (0, getSession_1.default)(req.body.username, req.body.password).then((credentials) => {
        if (credentials.error) {
            res.json({
                error: true,
                errorCode: 1
            });
        }
        else {
            axios_1.default.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", {
                headers: {
                    Cookie: credentials.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; "),
                    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31"
                }
            }).then((response) => {
                var _a, _b, _c, _d;
                const page = response.data.toString();
                const dom = new jsdom_1.default.JSDOM(page);
                const document = dom.window.document;
                const login = document.querySelector("#LogOnDetails_UserName");
                if (login !== null) {
                    res.json({
                        error: true,
                        errorCode: 3
                    });
                }
                else {
                    const courses = document.querySelectorAll(".AssignmentClass");
                    if (courses.length === 0) {
                        res.json({
                            error: true,
                            errorCode: 2
                        });
                    }
                    else {
                        let mp = "";
                        (_a = document.querySelector("#plnMain_ddlReportCardRuns")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("option").forEach((option) => {
                            if (option.getAttribute("selected") === "selected") {
                                mp = option.value;
                            }
                        });
                        mp = mp.split("-");
                        const year = mp[mp.length - 1].trim();
                        const nineWeeks = mp[0].trim();
                        const postData = {
                            __EVENTTARGET: "ctl00$plnMain$btnRefreshView",
                            __EVENTARGUMENT: "",
                            __VIEWSTATE: (_b = document.querySelector("#__VIEWSTATE")) === null || _b === void 0 ? void 0 : _b.getAttribute("value"),
                            __VIEWSTATEGENERATOR: (_c = document.querySelector("#__VIEWSTATEGENERATOR")) === null || _c === void 0 ? void 0 : _c.getAttribute("value"),
                            __EVENTVALIDATION: (_d = document.querySelector("#__EVENTVALIDATION")) === null || _d === void 0 ? void 0 : _d.getAttribute("value"),
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
                        };
                        axios_1.default.post("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", postData, {
                            headers: {
                                Cookie: credentials.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; "),
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31",
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }).then((response) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            const page = response.data.toString();
                            const dom = new jsdom_1.default.JSDOM(page);
                            const document = dom.window.document;
                            const courses = document.querySelectorAll(".AssignmentClass");
                            const data = [];
                            for (const course of courses) {
                                const fullName = course.querySelector(".sg-header-heading").textContent;
                                const code = fullName === null || fullName === void 0 ? void 0 : fullName.match(/([A-Z])\w+\s-\s[0-9]/g)[0];
                                const name = fullName === null || fullName === void 0 ? void 0 : fullName.replace(code, "").trim();
                                const testGrade = (_b = (_a = course.querySelector(".sg-header-heading.sg-right")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.match(/[0-9]*\.[0-9]+/i);
                                if (testGrade === null) {
                                    data.push({
                                        name: name,
                                        code: code,
                                        grade: "",
                                        assignments: []
                                    });
                                    continue;
                                }
                                const grade = testGrade[0];
                                const assignments = course.querySelector(".sg-asp-table");
                                const assignmentTable = assignments.querySelectorAll(".sg-asp-table-data-row");
                                const assignmentsData = [];
                                for (const assignment of assignmentTable) {
                                    const content = assignment.querySelectorAll("td");
                                    const due = (_c = content[0].textContent) === null || _c === void 0 ? void 0 : _c.trim();
                                    const assigned = (_d = content[1].textContent) === null || _d === void 0 ? void 0 : _d.trim();
                                    const name = (_e = content[2].textContent) === null || _e === void 0 ? void 0 : _e.replace(/\n/g, "").replace("*", "").trim();
                                    const category = (_f = content[3].textContent) === null || _f === void 0 ? void 0 : _f.replace(/\n/g, "").replace("*", "").trim();
                                    const score = (_g = content[4].textContent) === null || _g === void 0 ? void 0 : _g.replace(/\n/g, "").replace("*", "").trim();
                                    const totalPoints = (_h = content[5].textContent) === null || _h === void 0 ? void 0 : _h.trim();
                                    assignmentsData.push({
                                        due: due,
                                        assigned: assigned,
                                        name: name,
                                        category: category,
                                        score: score,
                                        totalPoints: totalPoints
                                    });
                                }
                                data.push({
                                    name: name,
                                    code: code,
                                    grade: grade,
                                    assignments: assignmentsData
                                });
                            }
                            res.json({
                                error: false,
                                grades: data,
                                mp: req.body.mp ? req.body.mp : nineWeeks
                            });
                        });
                    }
                }
            }).catch((error) => {
                console.log(error);
                res.json({
                    error: true,
                    errorCode: 1
                });
            });
        }
    });
});
app.post("/verify", (req, res) => {
    (0, getSession_1.default)(req.body.username, req.body.password).then((credentials) => {
        if (credentials.error) {
            res.json({
                error: true,
                errorCode: 1
            });
        }
        else {
            axios_1.default.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", {
                headers: {
                    Cookie: credentials.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; "),
                    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome"
                }
            }).then((response) => {
                const page = response.data.toString();
                const dom = new jsdom_1.default.JSDOM(page);
                const document = dom.window.document;
                const login = document.querySelector("#LogOnDetails_UserName");
                if (login !== null) {
                    res.json({
                        error: true,
                        errorCode: 3
                    });
                }
                else {
                    res.json({
                        error: false
                    });
                }
            }).catch(() => {
                res.json({
                    error: true,
                    errorCode: 1
                });
            });
        }
    });
});
app.post("/encrypt", (req, res) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const usernameBytes = aes_js_1.default.utils.utf8.toBytes(req.body.username);
    const passwordBytes = aes_js_1.default.utils.utf8.toBytes(req.body.password);
    const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key_256, new aes_js_1.default.Counter(5));
    const username = aes_js_1.default.utils.hex.fromBytes(aesCtr.encrypt(usernameBytes));
    const password = aes_js_1.default.utils.hex.fromBytes(aesCtr.encrypt(passwordBytes));
    res.json({
        username: username,
        password: password
    });
});
app.post("/decrypt", (req, res) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const usernameBytes = aes_js_1.default.utils.hex.toBytes(req.body.username);
    const passwordBytes = aes_js_1.default.utils.hex.toBytes(req.body.password);
    const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key_256, new aes_js_1.default.Counter(5));
    const username = aes_js_1.default.utils.utf8.fromBytes(aesCtr.decrypt(usernameBytes));
    const password = aes_js_1.default.utils.utf8.fromBytes(aesCtr.decrypt(passwordBytes));
    res.json({
        username: username,
        password: password
    });
});
app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
