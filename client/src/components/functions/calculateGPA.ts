// @ts-nocheck
import classes from "../ClassDB"

export default function calculateGPA(grades: any[], mp: number) {
    let counter = 0
    let total = 0
    const regex = /([A-Z])\w+/g
    for (const grade of grades) {
        let key = ""
        let i = 7
        while (!key) {
            Object.keys(classes).forEach((item) => {
                if (grade.code.includes(item.slice(0, i))) {
                    key = item
                }
            })
            i--;
            if (i === 0) {
                break
            }
        }
        console.log(key)
        if (Number(grade.grade) === 0 || isNaN(Number(grade.grade))) {
            if (!isNaN(Number(grade.grade))) {
                let scored = false
                for (const assignment of grade.assignments) {
                    if ((!(isNaN(Number(assignment.score))) || assignment.score === "L" || assignment.score === "ABS") && (assignment.category.includes("Assessment") || assignment.category.includes("Major"))) {
                        console.log(assignment.name)
                        scored = true
                        break
                    }
                }
                console.log(scored)
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
                console.log(`${total} + ${(classes[key].weight - subtraction) * classes[key].multiplier}`)
                total += (classes[key].weight - subtraction) * classes[key].multiplier
            }
            counter += classes[key].multiplier
        } else {
            counter += classes[key].multiplier
        }
    }
    if (counter === 0) {
        return -1
    } else {
        console.log(`${total} / ${counter}`)
        return (total / counter).toFixed(3)
    }
}