import { Card, CardBody } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

interface Props {
    title: string
    icon: JSX.Element,
    link: string
}

export default function HomeCard(props: Props) {
    const navigate = useNavigate()
    return (
        <div className="w-[300px] p-5" onClick={() => {
            navigate(props.link)
        }}>
            <Card className="cursor-pointer">
                <CardBody className="flex flex-col items-center justify-center p-10">
                    <h2 className="text-2xl font-bold pb-10">{props.title}</h2>
                    {props.icon}
                </CardBody>
            </Card>
        </div>
    )
}