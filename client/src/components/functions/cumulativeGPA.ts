import client from "../axios"
import classes from "../ClassDB"
import fetchGrades from "./fetchGrades"

export default async function cumulativeGPA(username: string, password: string, cookies: any): Promise<any> {
    try {
        if (!cookies) {
            const response = await client.post("/auth/verify", {
                username: username,
                password: password
            })
            if (response.data.error) {
                return {
                    error: true,
                    data: "error"
                }
            } else {
                cookies = response.data.cookies
                sessionStorage.setItem("cookies", JSON.stringify(cookies))
            }
        }
        const response = await client.post("/gpa/getData", {
            username: username,
            password: password,
            cookies: cookies
        })
        const data = response.data
        if (data.error) {
            if (data.errorCode === 1) {
                return {
                    error: true,
                    data: "timeout"
                }
            } else if (data.errorCode === 2) {
                return {
                    error: true,
                    data: "error"
                }
            } else if (data.errorCode === 3) {
                return await cumulativeGPA(username, password, null)
            }
        } else {
            let semester = 0
            if (!sessionStorage.getItem("totalCredits") || !sessionStorage.getItem("totalGpa") || !sessionStorage.getItem("semester")) {
                const transcript = await client.post("/transcript/getTranscript", {
                    username: username,
                    password: password,
                    cookies: cookies
                })
                let totalCredits = 0
                for (let i = 0; i < transcript.data.footers.length; i++) {
                    totalCredits += Number(transcript.data.footers[i])
                }
                for (let i = transcript.data.data.length - 1; i < transcript.data.data.length; i++) {
                    for (let j = 0; j < transcript.data.data[i].length; j++) {
                        if (transcript.data.data[i][j].sem2) {
                            semester = 2
                            break
                        } else if (transcript.data.data[i][j].sem1) {
                            semester = 1
                        }
                    }
                }
                sessionStorage.setItem("totalCredits", totalCredits.toString())
                sessionStorage.setItem("totalGpa", transcript.data.gpa.weighted)
                sessionStorage.setItem("semester", semester.toString())
            }
            semester = Number(sessionStorage.getItem("semester"))
            if (semester === 2) {
                return {
                    error: false,
                    gpa: Number(sessionStorage.getItem("totalGpa"))
                }
            }
            let gradesData = null
            let otherGradesData = null
            let mp = -1
            let otherMp = -1
            if (semester === 0) {
                gradesData = window.sessionStorage.getItem("1") ? JSON.parse(sessionStorage.getItem("1")!) : (await fetchGrades(username, password, cookies, 1)).data.grades
                otherGradesData = window.sessionStorage.getItem("2") ? JSON.parse(sessionStorage.getItem("2")!) : (await fetchGrades(username, password, cookies, 2)).data.grades
                mp = 1
                otherMp = 2
            } else if (semester === 1) {
                gradesData = window.sessionStorage.getItem("3") ? JSON.parse(sessionStorage.getItem("3")!) : (await fetchGrades(username, password, cookies, 3)).data.grades
                otherGradesData = window.sessionStorage.getItem("4") ? JSON.parse(sessionStorage.getItem("4")!) : (await fetchGrades(username, password, cookies, 4)).data.grades
                mp = 3
                otherMp = 4
            }
            if (gradesData.error || otherGradesData.error) {
                return {
                    error: true,
                    data: "error"
                }
            } else {
                let grades = gradesData
                sessionStorage.setItem(JSON.stringify(mp), JSON.stringify(grades))
                let otherGrades = otherGradesData
                sessionStorage.setItem(JSON.stringify(otherMp), JSON.stringify(otherGrades))
            }
            for (let i = 0; i < gradesData.length; i++) {
                let scored = true
                let otherScored = true
                if (Number(gradesData[i].grade) === 0 || isNaN(Number(gradesData[i].grade)) || Number(otherGradesData[i].grade) === 0 || isNaN(Number(otherGradesData[i].grade))) {
                    scored = false
                    otherScored = false
                    if (!isNaN(Number(gradesData[i].grade)) && !isNaN(Number(otherGradesData[i].grade))) {
                        for (const assignment of gradesData[i].assignments) {
                            if ((!(isNaN(Number(assignment.score))) || assignment.score === "L" || assignment.score === "ABS") && (assignment.category.includes("Assessment") || assignment.category.includes("Major"))) {
                                scored = true
                                break
                            }
                        }
                        for (const assignment of otherGradesData[i].assignments) {
                            if ((!(isNaN(Number(assignment.score))) || assignment.score === "L" || assignment.score === "ABS") && (assignment.category.includes("Assessment") || assignment.category.includes("Major"))) {
                                otherScored = true
                                break
                            }
                        }
                    }
                }
                if (scored && otherScored) {
                    const avg = (Math.round(Number(gradesData[i].grade)) + Math.round(Number(otherGradesData[i].grade))) / 2
                    gradesData[i].grade = avg.toString()
                }
            }
            console.log(gradesData)
            let totalCredits = Number(sessionStorage.getItem("totalCredits"))
            let totalPoints = Number(sessionStorage.getItem("totalGpa")) * totalCredits
            const data = getTotal(gradesData, mp)
            totalPoints += data.total
            totalCredits += data.credits
            const gpa = totalPoints / totalCredits
            sessionStorage.setItem("predictedGpa", gpa.toString())
            return {
                error: false,
                gpa: gpa
            }
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
            data: "error"
        }
    }
}

function getTotal(grades: any[], mp: number) {
    let counter = 0
    let total = 0
    for (const grade of grades) {
        let key = ""
        let i = 7
        while (!key) {
            Object.keys(classes).forEach((item) => {
                if (grade.code.includes(item.slice(0, i))) {
                    key = item
                }
            })
            i--
            if (i === 0) {
                break
            }
        }
        if (Number(grade.grade) === 0 || isNaN(Number(grade.grade))) {
            if (!isNaN(Number(grade.grade))) {
                let scored = true
                for (const assignment of grade.assignments) {
                    if ((!(isNaN(Number(assignment.score))) || assignment.score === "L" || assignment.score === "ABS") && (assignment.category.includes("Assessment") || assignment.category.includes("Major"))) {
                        scored = false
                        break
                    }
                }
                if (scored) {
                    counter += classes[key].multiplier
                }
            }
        } else if (Number(grade.grade) >= 70) {
            let subtraction = (100 - Math.round(Number(grade.grade))) / 10
            if (key === "SST45500Y") {
                if (mp <= 2) {
                    total += (classes[key].weight - subtraction) * classes[key].multiplier
                } else {
                    total += (classes[key].weight2 - subtraction) * classes[key].multiplier
                }
            } else if (!(classes[key].multiplier === 0)) {
                total += (classes[key].weight - subtraction) * classes[key].multiplier
            }
            counter += classes[key].multiplier
        } else {
            counter += classes[key].multiplier
        }
    }
    if (counter === 0) {
        return {
            total: 0,
            credits: 0
        }
    } else {
        return {
            total: total,
            credits: counter
        }
    }
}