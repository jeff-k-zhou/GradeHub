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
const express_1 = __importDefault(require("express"));
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const GradesRouter = express_1.default.Router();
GradesRouter.post("/getGrades", async (req, res) => {
    if (!req.body.cookies) {
        console.log("no cookies");
    }
    else {
        let response = await axios_1.default.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", {
            headers: {
                Cookie: req.body.cookies.map((cookie) => `${cookie}`).join("; "),
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31"
            }
        });
        let page = response.data.toString();
        let $ = cheerio.load(page);
        const login = $("#LogOnDetails_UserName");
        if (login.length !== 0) {
            console.log("invalid cookies");
            res.json({
                error: true,
                errorCode: 3
            });
        }
        else {
            const courses = $(".AssignmentClass");
            if (courses.length === 0) {
                res.json({
                    error: true,
                    errorCode: 2
                });
            }
            else {
                let mp = "";
                mp = $("#plnMain_ddlReportCardRuns").find(":selected").val();
                mp = mp.split("-");
                const year = mp[mp.length - 1].trim();
                const nineWeeks = mp[0].trim();
                console.log(nineWeeks, year);
                if (req.body.mp) {
                    const postData = {
                        __EVENTTARGET: "ctl00$plnMain$btnRefreshView",
                        __EVENTARGUMENT: "",
                        __VIEWSTATE: $("#__VIEWSTATE").attr("value"),
                        __VIEWSTATEGENERATOR: $("#__VIEWSTATEGENERATOR").attr("value"),
                        __EVENTVALIDATION: $("#__EVENTVALIDATION").attr("value"),
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
                        ctl00$plnMain$ddlReportCardRuns: `${req.body.mp}-${year}`,
                        ctl00$plnMain$ddlClasses: "ALL",
                        ctl00$plnMain$ddlCompetencies: "ALL",
                        ctl00$plnMain$ddlOrderBy: "Class",
                    };
                    response = await axios_1.default.post("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx", postData, {
                        headers: {
                            Cookie: req.body.cookies.map((cookie) => `${cookie}`).join("; "),
                            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36 Edg/117.0.2045.31",
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
                    page = response.data.toString();
                    $ = cheerio.load(page);
                }
                const courses = $(".AssignmentClass");
                const data = [];
                for (const course of courses) {
                    const fullName = $(course).find("a.sg-header-heading").text();
                    const code = fullName.match(/([A-Z])\w+\s-\s[0-9]/g)[0];
                    const name = fullName.replace(code, "").trim();
                    const testGrade = $(course).find(".sg-header-heading.sg-right").text().match(/[0-9]*\.[0-9]+/i);
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
                    const assignments = $(course).find(".sg-asp-table");
                    const assignmentTable = $(assignments).find(".sg-asp-table-data-row");
                    const assignmentsData = [];
                    for (const assignment of assignmentTable) {
                        const content = $(assignment).find("td");
                        const due = $(content[0]).text().trim();
                        const assigned = $(content[1]).text().trim();
                        const name = $(content[2]).text().replace(/\n/g, "").replace("*", "").trim();
                        const category = $(content[3]).text().replace(/\n/g, "").replace("*", "").trim();
                        const score = $(content[4]).text().replace(/\n/g, "").replace("*", "").trim();
                        const totalPoints = $(content[5]).text().trim();
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
            }
        }
    }
});
exports.default = GradesRouter;
