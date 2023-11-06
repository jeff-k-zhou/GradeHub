export default function unweightedGPA(grades: any[]) {
    let counter = 0
    let total = 0
    for (const grade of grades) {
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
                    counter += 1
                }
            }
        } else {
            if (Number(grade.grade) >= 90) {
                total += 4
            } else if (Number(grade.grade) >= 80) {
                total += 3
            } else if (Number(grade.grade) >= 70) {
                total += 2
            } else if (Number(grade.grade) >= 60) {
                total += 1
            }
            counter += 1
        }
    }
    if (counter === 0) {
        return -1
    } else {
        return (total / counter).toFixed(3)
    }
}