import { Button } from "@nextui-org/react"

interface Props {
    grade: string
    isLoading?: boolean
    className?: string
}

export default function GradeBadge(props: Props) {
    return (
        <Button isLoading={props.isLoading} color={
            props.grade.length === 0 || (isNaN(Number(props.grade)) && props.grade !== "L" && props.grade !== "ABS" && props.grade !== "CNS" && props.grade !== "CWS" && props.grade !== "INS")
                ? "default" : (Number(props.grade) >= 90 || props.grade === "CWS" || props.grade === "CNS") ? "primary" :
                    Number(props.grade) >= 80 ? "secondary" : Number(props.grade) >= 70 ? "warning" : "danger"
        } disableAnimation disableRipple className={`text-md cursor-default ${Number(props.grade) >= 70 && Number(props.grade) < 80 ? "text-white" : ""} ${props.className}`}>
            {props.grade.length === 0 ? "N/A" : props.grade }
        </Button>
    )
}