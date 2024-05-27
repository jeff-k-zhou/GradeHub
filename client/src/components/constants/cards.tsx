import { BarChart, Calculator, FileEarmark } from "react-bootstrap-icons"

const cards = [
    {
        title: "View Grades",
        icon: <BarChart size={100} />,
        link: "/grades"
    },
    {
        title: "Calculate GPA",
        icon: <Calculator size={100} />,
        link: "/gpa"
    },
    {
        title: "Transcript",
        icon: <FileEarmark size={100} />,
        link: "/transcript"
    }
]

export default cards