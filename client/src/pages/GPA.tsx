import Container from "../components/Container"
import Loading from "../components/Loading"
import Nav from "../components/Nav"
import { Card, CardBody, Progress, Skeleton, Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import calculateGPA from "../components/functions/calculateGPA"
import unweightedGPA from "../components/functions/unweightedGPA"
import fetchGrades from "../components/functions/fetchGrades"
import client from "../components/axios"
import Chart from "../components/Chart"
import { ArrowClockwise } from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom"

export default function GPA() {
    const [loading, setLoading] = useState(true)
    const [calculating, setCalculating] = useState(true)
    const [weighted, setWeighted] = useState<string>('N/A')
    const [unweighted, setUnweighted] = useState<string>('N/A')
    const [data, setData] = useState<any>(null)
    const [weight, setWeight] = useState<any>(null)
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const grades = [
        window.sessionStorage.getItem("1") ? JSON.parse(window.sessionStorage.getItem("1")!) : null,
        window.sessionStorage.getItem("2") ? JSON.parse(window.sessionStorage.getItem("2")!) : null,
        window.sessionStorage.getItem("3") ? JSON.parse(window.sessionStorage.getItem("3")!) : null,
        window.sessionStorage.getItem("4") ? JSON.parse(window.sessionStorage.getItem("4")!) : null
    ]
    useEffect(() => {
        const username = localStorage.getItem("username")
        const password = localStorage.getItem("password")
        if (username && password) {
            setLoading(false)
            if (grades[Number(window.sessionStorage.getItem("mp")!) - 1]) {
                const weighted = calculateGPA(grades[Number(window.sessionStorage.getItem("mp")!) - 1], Number(window.sessionStorage.getItem("mp")!))
                const unweighted = unweightedGPA(grades[Number(window.sessionStorage.getItem("mp")!) - 1])
                if (weighted !== -1 && unweighted !== -1) {
                    setWeighted(weighted.gpa)
                    setData(weighted.classes)
                    setWeight(weighted.weight)
                    console.log(weighted.weight)
                    setUnweighted(unweighted)
                } else {
                    setWeighted("N/A")
                    setUnweighted("N/A")
                }
                setCalculating(false)

            } else {
                client.post("/auth/decrypt", {
                    username: username,
                    password: password
                }).then((decryptedInfo) => {
                    let cookies = window.sessionStorage.getItem("cookies") ? JSON.parse(window.sessionStorage.getItem("cookies")!) : null
                    fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password, cookies).then((grades) => {
                        if (grades.error) {
                            console.log(grades.data)
                            setError(true)
                        } else {
                            const weighted = calculateGPA(grades.data.grades, Number(grades.data.mp))
                            const unweighted = unweightedGPA(grades.data.grades)
                            if (weighted !== -1 && unweighted !== -1) {
                                setWeighted(weighted.gpa)
                                setData(weighted.classes)
                                setWeight(weighted.weight)
                                setUnweighted(unweighted)
                            } else {
                                setWeighted("N/A")
                                setUnweighted("N/A")
                            }
                            window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
                            window.sessionStorage.setItem("mp", grades.data.mp)
                            setCalculating(false)
                        }
                    })
                })
            }
        } else {
            navigate("/login")
        }
    }, [])

    if (loading) {
        return <Container><Loading /></Container>
    } else if (error) {
        return (
            <Container>
                <Nav active={1} />
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                    <h1 className="font-normal text-xl w-5/6 text-center">There was an error fetching your GPA.</h1>
                    <Link to="/gpa">
                        <Button color="primary">
                            <ArrowClockwise size={20} />
                            Retry
                        </Button>
                    </Link>
                </div>
            </Container>
        )
    } else {
        return (
            <Container>
                <Nav active={1} />
                <div className="w-full flex flex-col items-center justify-center mt-10">
                    <div className="w-5/6 flex flex-col md:flex-row justify-center gap-y-3 md:gap-y-0 md:gap-x-10">
                        <Card className="w-full md:w-1/2 p-2">
                            <CardBody>
                                <h1 className="text-lg">Weighted GPA:</h1>
                                <Skeleton className="rounded-md w-1/2 mt-1" isLoaded={!calculating}>
                                    <h1 className="text-4xl bg-white">{weighted}</h1>
                                </Skeleton>
                                { /* @ts-ignore */}
                                <Progress size="lg" color={typeof weighted !== "string" ? "primary" : weighted > 5 ? "primary" : weighted > 4 ? "secondary" : weighted > 3 ? "warning" : "danger"} value={weighted} maxValue={6} className="mt-3" />
                            </CardBody>
                        </Card>
                        <Card className="w-full md:w-1/2 p-2">
                            <CardBody>
                                <h1 className="text-lg">Unweighted GPA:</h1>
                                <Skeleton className="rounded-md w-1/2 mt-1" isLoaded={!calculating}>
                                    <h1 className="text-4xl bg-white">{unweighted}</h1>
                                </Skeleton>
                                { /* @ts-ignore */}
                                <Progress size="lg" color={typeof unweighted !== "string" ? "primary" : unweighted > 3.5 ? "primary" : unweighted > 3 ? "secondary" : unweighted > 2 ? "warning" : "danger"} value={unweighted} maxValue={4} className="mt-3" />
                            </CardBody>
                        </Card>
                    </div>
                    <div className="w-5/6 h-full flex flex-col lg:flex-row lg:justify-center mt-3">
                        <div className="hidden lg:block w-1/3">
                            <div className="w-[95%] h-full">
                                <Card className="w-full h-full py-3 px-3">
                                    <Skeleton isLoaded={!calculating}>
                                        <CardBody className="w-full h-full flex flex-col justify-center gap-y-5 overflow-y-auto">
                                            {
                                                data ? data.map((item: any, index: any) => (
                                                    <div key={index}>
                                                        {item}: {weight[index]}
                                                    </div>
                                                )) : <></>
                                            }
                                        </CardBody>
                                    </Skeleton>
                                </Card>
                            </div>
                        </div>
                        <Chart />
                    </div>
                </div>
            </Container>
        )
    }
}