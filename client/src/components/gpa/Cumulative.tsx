import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, Progress, Skeleton, Button } from "@nextui-org/react"
import { ArrowClockwise } from "react-bootstrap-icons"
import cumulativeGPA from "../functions/cumulativeGPA"
import decrypt from "../functions/decrypt"
import GPAChart from "./GPAChart"
import calculateIncrease from "../functions/calculateIncrease"
import { ArrowUp, ArrowDown } from "react-bootstrap-icons"

export default function Cumulative() {
    const [loading, setLoading] = useState(true)
    const [weighted, setWeighted] = useState<string>('N/A')
    const [oldGpa, setOldGpa] = useState<string>('N/A')
    const [error, setError] = useState(false)
    const [count, setCount] = useState(0)
    const [change, setChange] = useState<string>('N/A')
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        setError(false)
        if (sessionStorage.getItem("predictedGpa") && sessionStorage.getItem("totalGpa")) {
            setLoading(false)
            let gpa = Number(sessionStorage.getItem("predictedGpa")!).toFixed(4).toString()
            setOldGpa(sessionStorage.getItem("totalGpa")!)
            setWeighted(gpa)
            setChange(calculateIncrease(Number(sessionStorage.getItem("totalGpa")!), Number(gpa)).toFixed(2).toString())
        } else {
            const username = localStorage.getItem("username")
            const password = localStorage.getItem("password")
            if (username && password) {
                let cookies = window.sessionStorage.getItem("cookies") ? JSON.parse(window.sessionStorage.getItem("cookies")!) : null
                decrypt(username!, password!).then((decryptedInfo: any) => {
                    cumulativeGPA(decryptedInfo.username, decryptedInfo.password, cookies).then((gpa: any) => {
                        if (gpa.error) {
                            setError(true)
                        } else {
                            setWeighted(gpa.gpa.toFixed(4))
                            setOldGpa(sessionStorage.getItem("totalGpa")!)
                            setChange(calculateIncrease(Number(sessionStorage.getItem("totalGpa")!), gpa.gpa).toFixed(2).toString())
                        }
                        setLoading(false)
                    })
                })
            } else {
                navigate("/login")
            }
        }
    }, [count])

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                <h1 className="font-normal text-xl w-5/6 text-center">There was an error fetching your GPA.</h1>
                <Button color="primary" onClick={() => {
                    setCount(prevCount => prevCount + 1)
                }}>
                    <ArrowClockwise size={20} />
                    Retry
                </Button>
            </div>
        )
    } else {
        return (
            <div className="w-full flex flex-col items-center justify-center mt-5">
                <div className="w-5/6 flex flex-col md:flex-row justify-center gap-y-3 md:gap-y-0 md:gap-x-10">
                    <div className="w-full md:w-1/2 flex flex-col items-center gap-y-5">
                        <Card className="w-full p-2">
                            <CardBody>
                                <h1 className="text-lg">Predicted Cumulative GPA:</h1>
                                <Skeleton className="rounded-md w-1/2 mt-1" isLoaded={!loading}>
                                    <h1 className="text-4xl bg-white">{weighted}</h1>
                                </Skeleton>
                                { /* @ts-ignore */}
                                <Progress size="lg" color={typeof weighted !== "string" ? "primary" : weighted > 5 ? "primary" : weighted > 4 ? "secondary" : weighted > 3 ? "warning" : "danger"} value={weighted} maxValue={6} className="mt-3" />
                            </CardBody>
                        </Card>
                        <Card className="w-full p-2">
                            <CardBody>
                                <h1 className="text-lg">Percent Change:</h1>
                                <Skeleton className="rounded-md w-full mt-1 flex flex-col items-center p-3" isLoaded={!loading}>
                                    <h1 className="text-5xl bg-white flex flex-row" style={{ color: Number(change) > 0 ? "#17C964" : "#F31260" }}>
                                        {Number(change) > 0 ? "+" : ""}{change}%
                                        {
                                            Number(change) < 0 ? <ArrowDown className="text-xl mx-2" /> : <ArrowUp className="text-xl mx-2" />
                                        }
                                    </h1>
                                </Skeleton>
                            </CardBody>
                        </Card>
                    </div>
                    <Card className="w-full md:w-1/2 p-2">
                        <CardBody>
                            <GPAChart gpa1={Number(oldGpa)} gpa2={Number(weighted)} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        )
    }
}