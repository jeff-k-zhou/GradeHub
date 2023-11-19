import { Modal as Mod, ModalBody, ModalHeader, ModalContent } from "@nextui-org/react"
import { useState, useEffect } from "react"

interface Props {
    isOpen: boolean
    onOpenChange: () => void
    assignment: any
}

export default function Modal(props: Props) {
    const[color, setColor] = useState<string>("")
    useEffect(() => {
        console.log(props.assignment.score)
        if ((Number.isNaN(Number(props.assignment.score)) && props.assignment.score !== "L" && props.assignment.score !== "INS" && props.assignment.score !== "CNS" && props.assignment.score !== "CWS" && props.assignment.score !== "ABS") || !props.assignment.score) {
            setColor("#a1a1aa")
            console.log("#a1a1aa")
        } else if (Number(props.assignment.score) >= 90 || props.assignment.score === "CWS" || props.assignment.score === "CNS") {
            setColor("#006FEE")
            console.log("#006FEE")
        } else if (Number(props.assignment.score) >= 80) {
            setColor("#9353d3")
            console.log("#9353d3")
        } else if (Number(props.assignment.score) >= 70) {
            setColor("#fbbf24")
            console.log("#fbbf24")
        } else {
            setColor("#f31260")
            console.log("#f31260")
        }
    }, [props.assignment])
    return (
        <Mod isOpen={props.isOpen} onClose={props.onOpenChange}>
            <ModalContent>
                <ModalHeader className="w-full flex justify-center flex-row">
                    <h1 className="w-full text-center">{props.assignment.name}</h1>
                </ModalHeader>
                <ModalBody className="pb-5 flex flex-col items-center w-full">
                    <div className="text-white rounded-md w-full text-center py-4" style={{ backgroundColor: color }}>
                        {props.assignment.category}
                    </div>
                    <div className="w-full flex flex-row">
                        <div className="w-1/2 flex flex-col items-start gap-y-3">
                            <div className="w-[95%] text-white text-center rounded-md py-2" style={{ backgroundColor: color }}>
                                <p className="text-sm">Date Assigned:</p>
                                <h1>{!props.assignment.assigned ? "N/A" : props.assignment.assigned}</h1>
                            </div>
                            <div className="w-[95%] text-white text-center rounded-md py-2" style={{ backgroundColor: color }}>
                                <p className="text-sm">Date Due:</p>
                                <h1>{!props.assignment.due ? "N/A" : props.assignment.due}</h1>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col items-end gap-y-3">
                            <div className="w-[95%] text-white text-center rounded-md py-2" style={{ backgroundColor: color }}>
                                <p className="text-sm">Score:</p>
                                <h1>{
                                    !props.assignment.score ? "N/A" : props.assignment.score
                                }</h1>
                            </div>
                            <div className="w-[95%] text-white text-center rounded-md py-2" style={{ backgroundColor: color }}>
                                <p className="text-sm">Total Points:</p>
                                <h1>{
                                    !props.assignment.totalPoints ? "N/A" : props.assignment.totalPoints
                                }</h1>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Mod>
    )
}