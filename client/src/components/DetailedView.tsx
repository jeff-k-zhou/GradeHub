import { ArrowLeft } from "react-bootstrap-icons"
import { Button, Card, CardBody, Progress, Divider, useDisclosure } from "@nextui-org/react"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import "./animations/slide.css"
import Modal from "./Modal"
import GradeBadge from "./GradeBadge"

interface Props {
    grades: any[]
    index: number
    class: number
    hidden: boolean
    toggle: Dispatch<SetStateAction<boolean>>
    scrollX: number
    scrollY: number
}

export default function DetailedView(props: Props) {
    const grades = props.grades[props.index]
    const [assessmentAverage, setAssessmentAverage] = useState("")
    const [progressAverage, setProgressAverage] = useState("")
    const [loading, setLoading] = useState<boolean>(true)
    const [assignment, setAssignment] = useState<any>({})
    const categories: Array<"Assessments of Learning" | "Progress Checks for Learning"> = ["Assessments of Learning", "Progress Checks for Learning"]
    useEffect(() => {
        let assessmentTotal = 0
        let assessmentCount = 0
        let progressTotal = 0
        let progressCount = 0
        if (grades) {
            grades[props.class].assignments.forEach((item: any) => {
                if (item.category.includes("Assessment")) {
                    if (item.score.length !== 0 && !isNaN(Number(item.score))) {
                        assessmentTotal += (Number(item.score) / Number(item.totalPoints)) * 100
                        assessmentCount++
                    } else if (item.score === "L" || item.score === "ABS") {
                        assessmentCount++
                    }
                } else if (item.category.includes("Progress")) {
                    if (item.score.length !== 0 && !isNaN(Number(item.score))) {
                        progressTotal += Number(item.score)
                        progressCount++
                    } else if (item.score === "L" || item.score === "ABS") {
                        progressCount++
                    }
                }
            })
        }
        if (!(assessmentCount === 0)) {
            setAssessmentAverage((assessmentTotal / assessmentCount).toFixed(2))
        } else {
            setAssessmentAverage("N/A")
        }
        if (!(progressCount === 0)) {
            setProgressAverage((progressTotal / progressCount).toFixed(2))
        } else {
            setProgressAverage("N/A")
        }
        setLoading(false)
    }, [grades, props.class])
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    if (props.hidden) {
        return <></>
    } else if (grades && grades[props.class]) {
        return (
            <>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} assignment={assignment} />
                <div className="w-full h-full flex flex-col items-center slideLeft">
                    <div className="w-5/6 md:w-[95%] flex sticky top-20 z-20">
                        <Button color="primary" isIconOnly onClick={() => {
                            scrollTo(props.scrollX, props.scrollY)
                            props.toggle(false)
                        }} aria-label="back" role="button">
                            <ArrowLeft />
                        </Button>
                    </div>
                    <div className="w-4/5 h-full flex flex-col items-center mt-5">
                        <div className="w-full">
                            <Card className="w-full flex py-3">
                                <CardBody className="w-full h-full flex flex-row items-center overflow-y-hidden px-6">
                                    <div className="w-2/3">
                                        <h1 className="text-xl">{grades[props.class].name}</h1>
                                        <Progress size="md" className="mt-2 hidden md:flex" color={Number(grades[props.class].grade) >= 90 ? "primary" : Number(grades[props.class].grade) >= 80 ? "secondary" : Number(grades[props.class].grade) >= 70 ? "warning" : "danger"} value={Number(grades[props.class].grade)}></Progress>
                                    </div>
                                    <div className="w-1/3 flex justify-center items-center h-full">
                                        <h1 className="text-2xl md:text-4xl">{grades[props.class].grade.length === 0 ? "0.00" : grades[props.class].grade}%</h1>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="w-full h-full flex flex-col lg:flex-row py-5">
                            {
                                categories.map((item, index) => (
                                    <div key={index} className={`lg:w-1/2 w-full flex ${index === 0 ? "lg:justify-start" : "lg:justify-end mt-5 lg:mt-0"}`}>
                                        <Card className="w-full lg:w-[97%] flex h-full px-2 py-2">
                                            <CardBody className="flex flex-col gap-y-5">
                                                <div className="w-full flex flex-row items-center">
                                                    <div className="w-2/3 lg:w-4/5">
                                                        <div className="w-[95%] whitespace-nowrap text-ellipsis overflow-hidden">
                                                            <h1 className="text-xl font-bold">{item}</h1>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/3 lg:w-1/5 flex justify-center">
                                                        <GradeBadge grade={index === 0 ? assessmentAverage : progressAverage} isLoading={loading} />
                                                    </div>
                                                </div>
                                                <Divider />
                                                <div className="w-full overflow-y-auto gap-y-5 flex flex-col">
                                                    {
                                                        grades[props.class].assignments.map((assignment: any, assignmentIndex: number) => {
                                                            if (index === 0 && (assignment.category.includes("Assessment") || assignment.category.includes("Major"))) {
                                                                return (
                                                                    <div key={assignmentIndex} className="w-full flex flex-row cursor-pointer items-center" onClick={() => {
                                                                        setAssignment(assignment)
                                                                        onOpen()
                                                                    }} aria-label="View assignment" role="button">
                                                                        <div className="w-2/3 lg:w-4/5">
                                                                            <div className="w-[95%] text-ellipsis whitespace-nowrap overflow-hidden">
                                                                                <h1 className="text-md">{assignment.name}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-1/3 lg:w-1/5 flex flex-row justify-center">
                                                                            <GradeBadge grade={assignment.score} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            } else if (index === 1 && (assignment.category.includes("Progress") || assignment.category.includes("Minor"))) {
                                                                return (
                                                                    <div key={assignmentIndex} className="w-full flex flex-row cursor-pointer items-center" onClick={() => {
                                                                        setAssignment(assignment)
                                                                        onOpen()
                                                                    }} aria-label="View assignment" role="button">
                                                                        <div className="w-2/3 lg:w-4/5">
                                                                            <div className="w-[95%] text-ellipsis whitespace-nowrap overflow-hidden">
                                                                                <h1 className="text-md">{assignment.name}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-1/3 lg:w-1/5 flex flex-row justify-center">
                                                                            <GradeBadge grade={assignment.score} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="w-full h-full flex flex-col items-center mt-5 slideLeft">
                <div className="w-[95%] flex">
                    <Button color="primary" isIconOnly onClick={() => {
                        props.toggle(false)
                    }}>
                        <ArrowLeft />
                    </Button>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="font-normal text-2xl">Error loading detailed view</h1>
                </div>
            </div>
        )
    }
}