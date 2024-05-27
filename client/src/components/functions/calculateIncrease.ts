export default function calculateIncrease(gpa1: number, gpa2: number) {
    const difference = gpa2 - gpa1
    return difference / gpa1 * 100
}